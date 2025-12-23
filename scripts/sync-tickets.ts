import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Baseline Ticket Sync Script (Azure DevOps)
 * 
 * Requirements in .env:
 * AZURE_TOKEN=your_personal_access_token
 * AZURE_ORG=your_organization
 * AZURE_PROJECT=your_project
 */

const AZURE_TOKEN = process.env.AZURE_TOKEN;
const AZURE_ORG = process.env.AZURE_ORG;
const AZURE_PROJECT = process.env.AZURE_PROJECT;
const OUTPUT_DIR = path.join(__dirname, '../.tr');

async function syncAzureTickets() {
    if (!AZURE_TOKEN || !AZURE_ORG || !AZURE_PROJECT) {
        console.error('❌ Missing Azure DevOps configuration in .env');
        console.log('Please set AZURE_TOKEN, AZURE_ORG, and AZURE_PROJECT.');
        return;
    }

    console.log(`🚀 Syncing tickets from ${AZURE_ORG}/${AZURE_PROJECT}...`);

    try {
        // Example WIQL query for Active Bugs
        const queryUrl = `https://dev.azure.com/${AZURE_ORG}/${AZURE_PROJECT}/_apis/wit/wiql?api-version=6.0`;
        const authHeader = {
            Authorization: `Basic ${Buffer.from(`:${AZURE_TOKEN}`).toString('base64')}`
        };

        const queryResponse = await axios.post(queryUrl, {
            query: "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.WorkItemType] = 'Bug' AND [System.State] <> 'Closed'"
        }, { headers: authHeader });

        const workItems = queryResponse.data.workItems;
        console.log(`✅ Found ${workItems.length} active bugs.`);

        const ticketData = [];

        for (const item of workItems) {
            const detailUrl = item.url;
            const detailResponse = await axios.get(detailUrl, { headers: authHeader });
            const fields = detailResponse.data.fields;

            ticketData.push({
                id: item.id,
                title: fields['System.Title'],
                state: fields['System.State'],
                severity: fields['Microsoft.VSTS.Common.Severity'] || 'N/A'
            });
        }

        // Save to .tr directory
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }

        fs.writeFileSync(
            path.join(OUTPUT_DIR, 'active_bugs.json'),
            JSON.stringify(ticketData, null, 2)
        );

        console.log(`📂 Saved insights to ${path.join(OUTPUT_DIR, 'active_bugs.json')}`);

    } catch (error: any) {
        console.error('❌ Error syncing tickets:', error.response?.data || error.message);
    }
}

// Run the sync
syncAzureTickets();
