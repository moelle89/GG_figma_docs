# Auto Property Table System

This system automatically injects property tables from the `props.json` file into component pages. It provides a clean, visual representation of component properties and their possible values without requiring any manual work.

## How It Works

1. The system is included in the main `index.html` file
2. When a component page loads, the system:
   - Detects the current page from the URL
   - Loads and parses the `props.json` file
   - Finds the matching component data based on the page name
   - Generates and injects a property table after the component description

## Files

The system consists of the following files:

- `js/prop-table-generator.js` - Core library for generating property tables
- `js/auto-prop-table.js` - Script that automatically injects tables into component pages
- `js/include-prop-tables.js` - Script that includes necessary files on component pages
- `css/prop-table.css` - Core styles for property tables
- `css/auto-prop-table.css` - Additional styles for auto-injected tables
- `pages/prop-table-demo.html` - Demo page for the property table generator
- `pages/auto-prop-table-demo.html` - Demo page for the auto-injection system
- `pages/button-test.html` - Test page for the Button component
- `pages/prop-table-test.html` - General test page for debugging

## Implementation

The system has already been implemented in the main `index.html` file:

```html
<!-- Property Table System -->
<script src="js/include-prop-tables.js"></script>
```

This script automatically:
1. Detects if the current page is a component page
2. Includes the necessary CSS and JavaScript files
3. Parses the `props.json` file
4. Finds the matching component data
5. Generates and injects the property table

## Requirements

For the property tables to be injected correctly:

1. Each component page must have a `.component-description` element
2. The component name in the URL must match a component name in `props.json`
   - The system handles kebab-case to space-separated conversion
   - It also tries reversed word order (e.g., "button-close" matches both "Button Close" and "Close Button")
   - Special cases are handled for components with non-standard naming

## Testing

You can test the system using the following pages:

- `/pages/button-test.html` - Tests the Button component
- `/pages/prop-table-test.html` - General test page for debugging

## Debugging

If you encounter issues with the property tables not being injected:

1. Open the browser console to see debug messages
2. Check that the component page has a `.component-description` element
3. Verify that the component name in the URL matches a component in `props.json`
4. Make sure the `props.json` file is correctly formatted

## Customization

You can customize the appearance of the tables by modifying:

- `css/prop-table.css` - For the core table styles
- `css/auto-prop-table.css` - For the auto-injected table styles

## Data Source

The system uses the `assets/_ts_props/props.json` file as its data source. This file contains TypeScript interface definitions for all components. 