import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  manifest: {
    name: "Paper to Notion",
    permissions: ['storage'],
    host_permissions: ['https://api.notion.com/*', 'https://api.crossref.org/*']
  },
});
