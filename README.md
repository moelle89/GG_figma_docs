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

1. Create a new component page in the `pages/` directory:
```html
<div class="component-description">
    <p>Component description here</p>
</div>

<div class="grid-2-col">
    <h2 class="section-title">Components</h2>
    <a href="figma-link" class="two-tone-button" target="_blank">
        <!-- Button content -->
    </a>
</div>

<!-- Component examples and documentation -->
```

2. Add component properties to `props.json`:
```typescript
{
    "ComponentName": {
        "property": "type",
        "variants": "'option1' | 'option2'",
        // ... more properties
    }
}
```

3. Add the component to the navigation menu in `index.html`.

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

### Setup
1. Clone the repository
2. Serve the directory using a local web server
3. Open `index.html` in your browser

### Generating Component Pages
The project includes an automated script for generating missing component pages:

1. Install Node.js if not already installed
2. Run the page generator:
```bash
npm run generate-pages
```

The script will:
- Check for components listed in both `components.json` and `menuData`
- Create missing component pages in the `/pages` directory
- Use a standardized template with:
  - Grid layout for component diagrams
  - Component description section
  - Figma button with diamond icon
  - Property table container
- Report the number of pages created
- Skip existing pages to prevent overwrites

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