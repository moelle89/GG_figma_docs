# Property Table System

This system automatically generates and injects property tables into component pages based on the data in `props.json`. It provides a clean, visual representation of component properties and their possible values.

## Features

- **Automatic Detection**: Automatically detects the current page and finds matching component data
- **Dynamic Injection**: Injects property tables into component pages without manual work
- **Responsive Design**: Tables look great on all device sizes
- **Dark Mode Support**: Automatically adapts to light/dark mode preferences
- **Type Formatting**: Special formatting for different data types (booleans, arrays, objects)

## Files

The system consists of the following files:

- `js/prop-table-generator.js` - Core library for generating property tables
- `js/auto-prop-table.js` - Script that automatically injects tables into component pages
- `js/include-prop-tables.js` - Script that includes necessary files on component pages
- `css/prop-table.css` - Core styles for property tables
- `css/auto-prop-table.css` - Additional styles for auto-injected tables
- `pages/prop-table-demo.html` - Demo page for the property table generator
- `pages/auto-prop-table-demo.html` - Demo page for the auto-injection system

## How It Works

1. The `include-prop-tables.js` script is included in the main template or layout file
2. When a component page loads, the script:
   - Detects that it's a component page
   - Dynamically includes the necessary CSS and JS files
   - The `auto-prop-table.js` script:
     - Loads and parses the `props.json` file
     - Finds the matching component data based on the page name
     - Generates and injects a property table after the component description

## Installation

1. Include the script in your main template or layout file:

```html
<script src="js/include-prop-tables.js"></script>
```

That's it! The script will automatically handle everything else.

## Demo Pages

- **Property Table Generator Demo**: `/pages/prop-table-demo.html`
  - Shows how to use the property table generator directly
  - Includes examples of different data types and structures

- **Auto Property Table Demo**: `/pages/auto-prop-table-demo.html`
  - Shows how property tables are automatically injected
  - Includes an interactive demo to preview different component tables

## Manual Usage

If you want to manually create a property table:

```javascript
// From a JavaScript object
const data = {
    'button label': 'Click me',
    'icon after': true,
    'icon before': false,
    'size': 'md',
    'type': 'Primary',
    'state': 'Default',
    'corner radius': 'Default'
};
createPropTable(data, 'Button Properties', 'container-id');

// From a TypeScript interface
const interfaceString = `
interface Button {
    button label: string; 
    icon after: boolean; 
    icon before: boolean; 
    size: 'sm' | 'md' | 'lg'; 
    type: 'Primary' | 'Secondary'; 
    state: 'Default' | 'Hover'; 
}`;
createPropTableFromInterface(interfaceString, 'Button Interface', 'container-id');
```

## Customization

You can customize the appearance of the tables by modifying:

- `css/prop-table.css` - For the core table styles
- `css/auto-prop-table.css` - For the auto-injected table styles

## Data Source

The system uses the `assets/_ts_props/props.json` file as its data source. This file contains TypeScript interface definitions for all components. 