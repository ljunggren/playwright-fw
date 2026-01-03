import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'https://conduit.bondaracademy.com';
const API_URL = 'https://conduit-api.bondaracademy.com/api';

async function checkConnectivity() {
    console.log('[PROACTIVE] Checking system connectivity...');

    try {
        // Check Web App
        console.log(`[GET] Checking Web App: ${BASE_URL}`);
        const webResponse = await axios.get(BASE_URL);
        if (webResponse.status === 200) {
            console.log('✅ Web App is ONLINE');
        }
    } catch (e) {
        console.error('❌ Web App is OFFLINE or UNREACHABLE');
    }

    try {
        // Check API
        console.log(`[GET] Checking API: ${API_URL}/tags`);
        const apiResponse = await axios.get(`${API_URL}/tags`);
        if (apiResponse.status === 200) {
            console.log('✅ API is ONLINE');
            console.log(`[API] Available tags: ${apiResponse.data.tags.slice(0, 5).join(', ')}...`);
        }
    } catch (e) {
        console.error('❌ API is OFFLINE or UNREACHABLE');
    }

    console.log('[PROACTIVE] Connectivity check complete.');
}

checkConnectivity().catch(err => {
    console.error('Fatal error during connectivity check:', err);
    process.exit(1);
});
