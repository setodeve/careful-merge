import { vi } from 'vitest';

// Mock WXT's defineContentScript global
vi.stubGlobal('defineContentScript', (config: { matches: string[]; main: () => void }) => {
  // Store the main function for testing
  (globalThis as Record<string, unknown>).__contentScriptMain = config.main;
  return config;
});
