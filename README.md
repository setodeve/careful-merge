![Careful Merge](assets/readme.png)

A Chrome extension that displays a confirmation dialog when clicking merge buttons on GitHub pull requests, showing the selected merge method before proceeding.

## Features

- **Merge method confirmation**: Shows a confirmation dialog when selecting merge, squash merge, or rebase merge
- **Visual distinction**: Each merge method is distinguished by color and icon
- **Dark mode support**: Automatically adapts to GitHub's dark mode
- **Keyboard shortcut**: Press Escape to cancel the dialog

## Installation

### From Source

1. Clone this repository
2. Install dependencies: `pnpm install`
3. Build the extension: `pnpm build`
4. Open `chrome://extensions` in Chrome
5. Enable "Developer mode" in the top right
6. Click "Load unpacked"
7. Select the `.output/chrome-mv3` folder

## Development

```bash
pnpm install         # Install dependencies
pnpm dev             # Start development mode with HMR
pnpm build           # Build for production
pnpm storybook       # Preview components in Storybook
```

## Usage

1. Navigate to a GitHub pull request page
2. Click the merge button as usual
3. A confirmation dialog will appear
4. Click "Confirm [merge method]" to proceed, or "Cancel" to abort

## Supported Merge Methods

| Merge Method       | Description                                       |
| ------------------ | ------------------------------------------------- |
| Merge commit       | Preserves all commits and creates a merge commit  |
| Squash and merge   | Combines all commits into one and merges          |
| Rebase and merge   | Rebases commits onto the base branch and merges   |

## Storybook

Component documentation is available at **[Storybook](https://setodeve.github.io/careful-merge/)**.

## Tech Stack

- [WXT](https://wxt.dev/) - web extension framework
- TypeScript
- [Storybook](https://storybook.js.org/) - Component preview

## Project Structure

```text
careful-merge/
├── entrypoints/
│   └── content.ts          # Content script
├── components/
│   └── ConfirmDialog.ts    # Dialog component
├── types/
│   └── index.ts            # Type definitions
├── assets/
│   └── styles.css          # Dialog styles
├── stories/
│   └── ConfirmDialog.stories.ts
├── .storybook/             # Storybook config
├── wxt.config.ts           # WXT config
└── package.json
```

## License

This project is licensed under the [MIT License](LICENSE).
