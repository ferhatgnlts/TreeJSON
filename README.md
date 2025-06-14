# TreeJSON - Interactive JSON Viewer

TreeJSON is a beautiful, interactive JSON viewer with syntax highlighting, collapsible nodes, and line numbers. It's built with pure HTML, CSS, and JavaScript.

## Features

- 🎨 Syntax highlighting for keys, strings, numbers, booleans, and null values
- 🌳 Collapsible/expandable tree structure for easy navigation
- 🔢 Line numbers for better readability
- 🚨 Error handling with highlighted error lines
- 📱 Responsive design that works on desktop and mobile
- 🚀 No dependencies - pure vanilla JavaScript

## Installation

No installation needed! Just clone the repo and open `index.html` in your browser:

```bash
git clone https://github.com/ferhatgnlts/treejson.git
cd treejson
open index.html
```

## Usage

1. Replace the sample JSON in `js/script.js` with your own JSON data
2. Open `index.html` in your browser
3. Interact with the JSON by clicking the `+`/`-` buttons to collapse/expand nodes

## Customization

You can easily customize the color scheme by editing the CSS variables in `css/style.css`:

```css
:root {
    --bg-color: #f5f5f5;
    --text-color: #333;
    --key-color: #9c27b0;
    --string-color: #4caf50;
    --number-color: #2196f3;
    --boolean-color: #ff9800;
    --null-color: #f44336;
    --bracket-color: #555;
}
```

## How It Works

- The JSON is parsed and converted to a DOM structure
- Each node is rendered with appropriate syntax highlighting
- Collapsible sections are implemented with CSS and JavaScript
- A MutationObserver watches for changes to update line numbers

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License
MIT © 2025 [Ferhat Gönültaş]