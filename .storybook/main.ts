import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|ts)'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  viteFinal: async (config) => {
    if (config.esbuild) {
      config.esbuild.tsconfigRaw = {
        compilerOptions: {
          target: 'ESNext',
          useDefineForClassFields: true,
          module: 'ESNext',
          lib: ['ESNext', 'DOM', 'DOM.Iterable'],
          skipLibCheck: true,
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          esModuleInterop: true,
          strict: true,
          jsx: 'preserve',
        },
      };
    }
    return config;
  },
};

export default config;
