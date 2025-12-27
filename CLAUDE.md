# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Careful Merge is a browser extension (Chrome/Edge/Firefox) that adds a confirmation dialog when clicking merge buttons on GitHub pull requests. It helps prevent accidental merges by showing the selected merge method (merge commit, squash, rebase) before proceeding.

## Development

This is a vanilla JavaScript browser extension with no build step, bundler, or dependencies.

**Manual testing:**
1. Load the extension unpacked in Chrome (`chrome://extensions` with developer mode) or Firefox (`about:debugging`)
2. Navigate to any GitHub PR page to test merge button interception

## Architecture

**content.js** - Single IIFE that:
- Defines `MERGE_TYPES` config (name, description, icon, color for each merge method)
- `createConfirmDialog()` - Builds modal DOM with event handlers (confirm/cancel/escape/overlay click)
- `detectMergeType()` - Determines merge type from button text or form action
- `interceptMergeButton()` - Attaches click handler that shows dialog, uses data attributes to track state
- `findAndInterceptMergeButtons()` - Queries multiple selectors to find GitHub merge buttons
- `observeDOM()` - MutationObserver to handle GitHub's SPA navigation and dynamic content

**styles.css** - Dialog styling with dark mode support via `prefers-color-scheme` media query and GitHub's `data-color-mode`/`data-dark-theme` attributes.

**manifest.json** - Manifest V3 configuration, content script runs on `github.com/*`.
