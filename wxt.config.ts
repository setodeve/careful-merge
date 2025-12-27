import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Careful Merge',
    description: 'Shows a confirmation dialog when clicking merge buttons on GitHub pull requests',
    version: '1.0.0',
    icons: {
      16: 'icon16.png',
      32: 'icon32.png',
      48: 'icon48.png',
      128: 'icon128.png',
    },
    action: {
      default_icon: {
        16: 'icon16.png',
        32: 'icon32.png',
        48: 'icon48.png',
        128: 'icon128.png',
      },
    },
  },
});
