// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path'; // Optional, but good for safety

dotenv.config();

export default defineConfig({
  // FIX: Just use the string path. 
  // Playwright resolves this relative to the config file.
  globalSetup: './tests/global-setup.ts', 
  reporter: [['list'], ['html']], 
  outputDir: 'test-results',

  use: {
    // Tell Playwright to load the saved cookies/state for every test
    storageState: 'user.json', 
    baseURL: 'https://conduit.bondaracademy.com', // Update if needed
    trace: 'on-first-retry',
    // Options: 'on' | 'off' | 'retain-on-failure' | 'on-first-retry'
    video: 'retain-on-failure',
    // Only for local debugging
    //video: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // ... other browsers
  ],
});