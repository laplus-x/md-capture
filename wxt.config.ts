import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'md-capture',
    version: '1.0.0',
    description: 'Convert current webpage to Markdown using markdown.new',
    permissions: ['activeTab'],
    host_permissions: ['https://markdown.new/*'],
    action: {
      default_title: 'Capture page as Markdown',
    },
  },
});
