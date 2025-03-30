# Component Library

A modern, interactive component library that showcases UI components with live examples, documentation, and property tables. Built with vanilla JavaScript and CSS for maximum compatibility and performance.

## Features

### 1. Interactive Component Navigation
- **Sidebar Navigation**: Easy access to all components, organized by categories
- **Search Functionality**: Quick component search with real-time filtering
- **Category Sorting**: Toggle between alphabetical and default category sorting
- **Mobile Responsive**: Collapsible sidebar for mobile devices

### 2. Component Display
- **Live Examples**: Interactive component demonstrations
- **Component Properties**: Automatically generated property tables from TypeScript interfaces
- **Visual Documentation**: Images and diagrams showing component variations
- **Figma Integration**: Direct links to component designs in Figma

### 3. Property Table System
The library includes an automatic property table generation system that:
- Parses TypeScript interfaces from `props.json`
- Automatically generates formatted property tables
- Displays property names, types, and possible values
- Updates dynamically when navigating between components

### 4. Animation System
- **Scroll Animations**: Elements animate as they enter the viewport
- **Transition Effects**: Smooth transitions between component pages
- **Loading States**: Visual feedback during content loading

### 5. Theme Support
- **Light/Dark Mode**: System-wide theme switching
- **Persistent Settings**: Theme preference is saved between sessions
- **System Preference**: Automatically matches system theme preference

## File Structure

```
├── assets/
│   ├── _ts_props/
│   │   └── props.json         # Component property definitions
│   ├── cards/                 # Component category images
│   └── icons/                 # UI icons
├── css/
│   ├── app.css               # Main application styles
│   ├── comp_cards.css        # Component card styles
│   ├── prop-table.css        # Property table styles
│   └── auto-prop-table.css   # Auto-generated table styles
├── js/
│   ├── app.js               # Main application logic
│   ├── prop-table-generator.js    # Property table generation
│   ├── auto-prop-table.js        # Automatic table injection
│   └── include-prop-tables.js    # Property table system loader
├── scripts/
│   └── generate-missing-pages.js  # Component page generator script
├── pages/                    # Component page templates
├── package.json             # Project configuration and scripts
└── index.html               # Main application entry
```

## Usage

### Adding New Components

Adding new components to the library is a simple three-step process:

1. **Step 1:** Add the new component name to the `menuData` array in `index.html`:
```javascript
const menuData = [
    { "category": "Your Category", "items": ["Your New Component"] },
    // ... existing categories and items
];
```

2. **Step 2:** Run the fetch script to generate the initial component data:
```bash
npm run fetch-new-component-data
```

This will automatically:
- Create a new entry in `components.json` with the following structure:
- Generate the component's content page in the `/pages` directory

```json
{
    "your-new-component": {
        "name": "Your New Component",
        "description": "description",
        "figmaLink": "url to the actual component within the figma file",
        "figmaProto": "url to the component's prototype used to present it on this site",
        "figmaButtonText": "Your New Component",
        "imagePath1": "assets/prop_table/empty.png",
        "imagePath2": "assets/prop_table/empty.png"
    }
}
```

3. **Step 3:** Update the component data in `components.json`:
- Add the Figma URL of your component to the `figmaLink` field
- Add the prototype URL to the `figmaProto` field

> **Important Note:** The component page will be automatically generated with a standard template. You only need to provide the Figma URLs to make it fully functional.

### Property Table System

The property table system automatically:
- Detects the current component page
- Loads the corresponding properties from `props.json`
- Generates and injects a formatted table
- Updates when navigating between components

### Theme Customization

Modify theme variables in `css/app.css`:
```css
[data-theme="light"] {
    --bg-color: #ffffff;
    --text-color: #000000;
    /* ... more variables */
}

[data-theme="dark"] {
    --bg-color: #171717;
    --text-color: #ffffff;
    /* ... more variables */
}
```

## Development

### Prerequisites
- Modern web browser
- Local web server (for development)
- Node.js (for running npm scripts)

### Setup
1. Clone the repository
2. Serve the directory using a local web server
3. Open `index.html` in your browser

### NPM Scripts
The project includes several npm scripts for managing component data and generating pages:

```bash
# Fetch new component data from Figma and update the documentation
npm run fetch-new-component-data

# Combine component data and generate missing pages
npm run combine-and-generate

# Generate missing component pages
npm run generate-pages

# Wrap component playgrounds with tabs for different views
npm run wrap-playgrounds
```

Each script performs specific tasks:

- `fetch-new-component-data`: Updates the component data by:
  - Running `updateComponents.js` to fetch new data from Figma
  - Automatically running `combine-and-generate` to process the new data

- `combine-and-generate`: Processes component data by:
  - Running `combine.js` to merge component data
  - Automatically running `generate-pages` to create missing pages

- `generate-pages`: Creates missing component pages by:
  - Checking for components listed in both `components.json` and `menuData`
  - Creating missing pages in the `/pages` directory
  - Using a standardized template with proper structure
  - Skipping existing pages to prevent overwrites

- `wrap-playgrounds`: Adds interactive playground containers to component pages by:
  - Processing all HTML files in the `/pages` directory
  - Adding tabbed interfaces for different views (Figma, How-to use, iOS, MD)
  - Preserving existing content while adding new functionality
  - Skipping files that already have playground containers

### Adding Features
1. Component pages are loaded dynamically from the `pages/` directory
2. Styles are organized by feature in the `css/` directory
3. JavaScript functionality is modular in the `js/` directory

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License
MIT License - feel free to use this component library in your projects.