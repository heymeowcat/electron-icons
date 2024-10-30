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
- `icon.png` - Windows icon (256x256)
- `icon_512x512.png` - Linux icon

## Requirements

- Node.js 14 or higher
- For macOS icons: Must be run on macOS (requires `iconutil`)
