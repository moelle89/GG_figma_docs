const fs = require('fs');
const path = require('path');

// Read components and menu data
const componentsData = require('../data/components.json');
const menuData = [
    { "category": "First Steps", "items": ["UI component lib"] },
    { "category": "Button", "items": ["Button", "Button Group", "Button Close", "Button with Icon Only", "Social Button", "Store Badges"] },
    { "category": "Input Fields", "items": ["Input"] },
    { "category": "Checkboxes", "items": ["Checkbox", "Checkbox Label"] },
    { "category": "Radio Buttons", "items": ["Radio Button", "Radio Button Group"] },
    { "category": "Toggles", "items": ["Toggle Switch", "Toggle Label"] },
    { "category": "Drop-Downs", "items": ["Drop-Down Box", "Drop-Down Menu"] },
    { "category": "Tabs", "items": ["Horizontal Tabs", "Vertical Tabs", "Tab Button"] },
    { "category": "Modals", "items": ["Modal Header", "Modal Actions"] },
    { "category": "Pagination", "items": ["Pagination", "Pagination Dots"] },
    { "category": "Progress Loaders", "items": ["Linear Loader", "Linear Loader (Looping)", "Radial Loader", "Radial Loader (Looping)", "Radial Loader (Looping) 2"] },
    { "category": "Badges & Tags", "items": ["Badge"] },
    { "category": "Icons", "items": ["Icons"] },
    { "category": "Content", "items": ["Content Frames", "Content Slots", "Content Header", "Content Slot"] },
    { "category": "Lists", "items": ["Check List Item", "Class List Item"] },
    { "category": "Tables", "items": ["Table Cell"] },
    { "category": "Accordion", "items": ["Accordion", "Accordion Item"] },
    { "category": "Headers", "items": ["Card Header", "Page Header", "Section Header"] },
    { "category": "Dividers", "items": ["Divider"] },
    { "category": "Info Cards", "items": ["Info Card"] },
    { "category": "Empty States", "items": ["Empty State", "Empty State Graphic"] },
    { "category": "Inbox", "items": ["Content / Inbox / Classic", "Content / Inbox / Compact", "Mail Navigation List Item"] },
    { "category": "Signup & Login", "items": ["Login Sections", "Signup Sections"] },
    { "category": "Logos", "items": ["GG Logo", "GG Logo Icon", "GG Logo Mark"] },
    { "category": "Miscellaneous", "items": ["Avatar", "Avatar Labeled", "Avatar Stack"] }
];

// Template for new component pages
const pageTemplate = (componentName) => `
<div class="content-container">
    <div class="grid-2-col">
        <div class="grid-item slide-in-left-on-scroll">
            <img src="" alt="${componentName} - diagram 1" data-prop-img>
        </div>
        <div class="grid-item slide-in-right-on-scroll">
            <img src="" alt="${componentName} - diagram 2" data-prop-img>
        </div>
    </div>

    <div class="component-description">
        <p class="has-opacity"></p>
    </div>

    <div class="figma-button-container">
        <a href="" class="two-tone-button" target="_blank" data-figma-link>
            <div class="button-left">${componentName}<div class="diamond-icon">
                    <div class="diamond-group">
                        <div class="diamond-item"></div>
                        <div class="diamond-item"></div>
                        <div class="diamond-item"></div>
                        <div class="diamond-item"></div>
                    </div>
                </div>
            </div>
            <div class="button-right">in figma anzeigen</div>
        </a>
    </div>

    <div class="prop-table-container"></div>
</div>
`;

// Function to convert component name to filename
function getPageFilename(componentName) {
    return componentName.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-') + '.html';
}

// Create pages directory if it doesn't exist
const pagesDir = path.join(__dirname, '../pages');
if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir);
}

// Collect all component names from both sources
const allComponents = new Set();

// Add components from menuData
menuData.forEach(category => {
    category.items.forEach(item => {
        allComponents.add(item);
    });
});

// Add components from components.json
Object.keys(componentsData).forEach(key => {
    allComponents.add(componentsData[key].name);
});

// Check and create missing pages
let createdCount = 0;
allComponents.forEach(componentName => {
    const filename = getPageFilename(componentName);
    const filePath = path.join(pagesDir, filename);

    if (!fs.existsSync(filePath)) {
        console.log(`Creating page for: ${componentName}`);
        fs.writeFileSync(filePath, pageTemplate(componentName));
        createdCount++;
    }
});

console.log(`\nProcess completed!`);
console.log(`Created ${createdCount} new component pages`);
console.log(`Pages are located in: ${pagesDir}`); 