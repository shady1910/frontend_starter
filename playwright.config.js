import { defineConfig, devices } from '@playwright/test';

const port = 4174;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  forbidOnly: Boolean(process.env.CI),
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL, reducedMotion: 'reduce', trace: 'retain-on-failure' },
  projects: [
    { name: 'Chromium Desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'Chromium Mobil', use: { ...devices['Pixel 7'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort --bypass-lock`,
    url: baseURL,
    reuseExistingServer: false,
  },
});
