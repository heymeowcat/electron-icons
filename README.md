# electron-icons

Generate platform-specific icons for Electron applications.

## Installation

`npm install -D electron-icons`

## Usage

Add a script to your package.json:

    {
        "scripts":  {
    		"generate-icon":electron-icons -i relative/path/file.png -o relative/path/folder
    	}
    }

Then run:

`npm run generate-icon`

## Generated Files

- `icon.icns` - macOS icon (includes layers)
- `icon.ico` - Windows icon
- `icon.png` - Linux icon

## Requirements

- Node.js 14 or higher
- For macOS icons: Must be run on macOS (requires `iconutil`)
