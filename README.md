# Careful Merge

[日本語版はこちら](README_ja.md)

A browser extension that displays a confirmation dialog when clicking merge buttons on GitHub pull requests, showing the selected merge method before proceeding.

## Features

- **Merge method confirmation**: Shows a confirmation dialog when selecting merge, squash merge, or rebase merge
- **Visual distinction**: Each merge method is distinguished by color and icon
- **Dark mode support**: Automatically adapts to GitHub's dark mode
- **Keyboard shortcut**: Press Escape to cancel the dialog

## Installation

1. Download or clone this repository
2. Open `chrome://extensions` in Chrome
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the downloaded folder

## Usage

1. Navigate to a GitHub pull request page
2. Click the merge button as usual
3. A confirmation dialog will appear
4. Click "Confirm [merge method]" to proceed, or "Cancel" to abort

## Supported Merge Methods

| Merge Method | Description |
|--------------|-------------|
| Merge commit | Preserves all commits and creates a merge commit |
| Squash and merge | Combines all commits into one and merges |
| Rebase and merge | Rebases commits onto the base branch and merges |

## File Structure

```
careful-merge/
├── manifest.json   # Extension configuration
├── content.js      # Main script
├── styles.css      # Dialog styles
└── README.md       # This file
```

## License

MIT License
