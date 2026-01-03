// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path'; // Optional, but good for safety

dotenv.config();

export default defineConfig({
  globalSetup: './tests/global-setup.ts',
  reporter: [['list'], ['html']],
  outputDir: 'test-results',

  use: {
    storageState: 'user.json',
    baseURL: 'https://conduit.bondaracademy.com',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'init',
      testDir: './tests-cleanup',
      testMatch: /.*\.spec\.ts/,
    },
    {
      name: 'smoke',
      testDir: './tests',
      grep: /@smoke/,
      dependencies: ['init'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'regression',
      testDir: './tests',
      grepInvert: /@smoke/,
      dependencies: ['smoke'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});