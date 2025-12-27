# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Careful Merge is a Chrome browser extension that adds a confirmation dialog when clicking merge buttons on GitHub pull requests. It helps prevent accidental merges by showing the selected merge method (merge commit, squash, rebase) before proceeding.

## Tech Stack

- **WXT** - Next-gen web extension framework (Vite-based)
- **TypeScript** - Type-safe JavaScript
- **Storybook** - Component preview and documentation

## Development Commands

```bash
pnpm dev            # Start development mode with HMR
pnpm build          # Build extension for production
pnpm zip            # Create distributable ZIP
pnpm storybook      # Preview components in Storybook
pnpm build-storybook # Build static Storybook
```

## Manual Testing

1. Run `pnpm build`
2. Load `.output/chrome-mv3` folder in Chrome (`chrome://extensions` with developer mode)
3. Navigate to any GitHub PR page to test merge button interception

## Architecture

```
careful-merge/
├── entrypoints/
│   └── content.ts      # Content script entry point
├── components/
│   └── ConfirmDialog.ts # Dialog component (createConfirmDialog, detectMergeType)
├── types/
│   └── index.ts        # TypeScript type definitions
├── assets/
│   └── styles.css      # Dialog styling with dark mode support
├── stories/
│   └── ConfirmDialog.stories.ts # Storybook stories
├── .storybook/         # Storybook configuration
├── wxt.config.ts       # WXT configuration
└── tsconfig.json       # TypeScript configuration
```

### Key Components

**components/ConfirmDialog.ts**
- `MERGE_TYPES` - Configuration object with name, description, icon, color for each merge method
- `createConfirmDialog()` - Builds modal DOM with event handlers
- `detectMergeType()` - Determines merge type from button text or form action

**entrypoints/content.ts**
- `interceptMergeButton()` - Attaches click handler that shows dialog
- `findAndInterceptMergeButtons()` - Queries selectors to find GitHub merge buttons
- `observeDOM()` - MutationObserver for GitHub's SPA navigation

**assets/styles.css**
- Dark mode support via `prefers-color-scheme` and GitHub's `data-color-mode` attribute
