import { defineConfig } from 'wxt';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  manifest: {
    name: 'md-capture',
    version: pkg.version,
    description: 'Convert current webpage to Markdown using markdown.new',
    permissions: ['activeTab'],
    host_permissions: ['https://markdown.new/*'],
    action: {
      default_title: 'Capture page as Markdown',
    },
  },
});
