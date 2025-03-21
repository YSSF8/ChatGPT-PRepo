# ChatGPT-PRepo

A Chrome extension providing predefined prompts for ChatGPT. Access a curated collection of prompts to enhance your ChatGPT interactions.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

- Search through prompts
- Sort prompts alphabetically (A-Z or Z-A)
- Easy one-click insertion of prompts into ChatGPT
- Developer-focused prompts highlighted
- Modern, dark-themed UI
- Favorite prompts functionality
  - Right-click any prompt to add/remove from favorites
  - Favorite prompts appear at the top of the list
- Custom prompts management
  - Add your own prompts via the `+` button
  - Custom prompts highlighted with a colored border
  - Right-click to remove custom prompts
- Responsive context menu system
  - Right-click prompts to access additional actions
  - Context-aware options based on prompt type

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the cloned repository folder

## Project Structure

```
ChatGPT-PRepo/
├── data/
│   └── prompts.csv             # Prompts database
├── icons/
│   ├── original.png            # Original icon
│   ├── original_small.png      # Small icon variant
│   └── original_smaller.png    # Smaller icon variant
├── scripts/
│   ├── context-menu.js         # Context menu implementation
│   ├── csv-parser.js           # CSV file parser
│   ├── favorites-manager.js    # Favorites functionality
│   ├── header.js               # Header UI functionality
│   ├── main.js                 # Main extension logic
│   └── messages.js             # Handles user messaging
├── style/
│   ├── style.css               # Compiled styles
│   └── style.scss              # Source styles
├── manifest.json               # Extension manifest
├── popup.html                  # Extension popup UI
├── icon_editor.py              # Icon resize utility script
├── README.md                   # Project documentation
└── LICENSE                     # License file
```

## Development

The extension is built using vanilla JavaScript and SCSS. The prompt database is stored in a CSV file for easy maintenance.

### Key Components

- **CSVParser**: Handles reading and parsing the prompts database
- **Modal**: Reusable modal dialog component for UI interactions
- **ContextMenu**: Handles right-click menu interactions
- **FavoritesManager**: Manages user's favorite prompts
- **EventTarget**: based event system for component communication

## Contributing

Feel free to contribute by:

1. Adding new prompts to `data/prompts.csv`
2. Improving the UI/UX
3. Adding new features
4. Fixing bugs

## License

This project is open source and licensed under the MIT License. Please ensure you have the right to use any prompts you contribute.