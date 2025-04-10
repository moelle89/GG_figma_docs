const fs = require('fs');
const path = require('path');

// Function to extract protoId from figmaProto URL
function extractProtoId(figmaProto) {
    const regex = /node-id=(\d+-\d+)/; // Regular expression to match the node-id
    const match = figmaProto.match(regex); // Execute the regex on the figmaProto string
    return match ? match[1] : null; // Return the protoId or null if not found
}
// Function to extract menuData from index.html
function extractMenuData() {
    const indexPath = path.join(__dirname, '../data/menu.json');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');

    // Regular expression to find the menuData variable
    const menuDataRegex = /let\s+menuData\s*=\s*(\[[\s\S]*?\]);/;
    const match = indexContent.match(menuDataRegex);

    if (match && match[1]) {
        return JSON.parse(match[1]); // Parse the JSON string to an object
    }
    return []; // Return an empty array if not found
}
// Read components and menu data
const componentsData = require('../data/components.json');
const menuData = extractMenuData(); // Extract menuData from index.html

const pageTemplate = (componentName, protoId) => `
<div class="video-container">
    <div class="video-ratio-container">
        <video controls autoplay muted loop>
            <source type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>
</div>
<div class="component-description" data-description-container>
    <p class="has-opacity">Description goes here</p>
</div>

<div class="grid-2-col" style="max-width: 900px;">
    <div>
        <h2 class="section-title">❖ Component</h2>
    </div>
    <div>
        <a href="#" class="two-tone-button" target="_blank" data-figma-link>
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
</div>
<div class="playground__container">
    <div class="playground__tabs">
        <button class="playground__tab" data-tab="figma">figma</button>
        <button class="playground__tab" data-tab="how-to use">how-to use</button>
        <span style="flex: 1"></span>
        <button class="playground__tab2 playground__tab--secondary" data-tab="ios">scroll or drag inside the playground to see potential content</button>
    </div>
    <div class="playground__content" data-content="figma">
        <div class="fig-container">
            <iframe src="https://www.figma.com/embed?embed_host=moelle&url=https://www.figma.com/proto/t23EtqNAyknCBnrnaEOYwq/Allgemein?page-id=2711%3A1249&node-id=6247-49071&viewport=-12643%2C-17216%2C0.94&t=crNjXrqpuXve3MK8-8&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=6247-49071&show-proto-sidebar=0&hide-ui=1" allowfullscreen>
            </iframe>
        </div>
    </div>
    <div class="playground__content" data-content="how-to use">
        <div class="playground_tab_container"><h2>work in progress</h2></div>
    </div>
    <div class="playground__content" data-content="ios">
        <!-- iOS content -->
    </div>
    <div class="playground__content" data-content="md">
        <!-- MD content -->
    </div>
</div>
<div class="grid-2-col">
    <div class="grid-item">
        <img src="assets/img/Prop Table - Avatar stack.jpg" alt="Component diagram" data-prop-img>
    </div>
    <div class="grid-item image-slider">
        <!-- Start cssSlider.com -->
        <img src="assets/img/empty.png" alt="Component diagram" data-prop-img>
        <!-- End cssSlider.com -->
    </div>
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
        allComponents.add(item.toLowerCase()); // Normalize to lowercase
    });
});

// Add components from components.json
Object.keys(componentsData).forEach(key => {
    allComponents.add(key); // Use the key directly (which is in lowercase)
});

// Debugging: Log all components being processed
console.log('All components to be processed:', Array.from(allComponents));

// Check and create missing pages
let createdCount = 0;
allComponents.forEach(componentName => {
    const filename = getPageFilename(componentName);
    const filePath = path.join(pagesDir, filename);

    if (!fs.existsSync(filePath)) {
        console.log(`Creating page for: ${componentName}`);

        // Extract component data from componentsData
        const componentData = componentsData[componentName];
        if (componentData) {
            // Extract protoId if figmaProto exists
            const protoId = componentData.figmaProto ? extractProtoId(componentData.figmaProto) : 6247 - 49071;
            console.log(`ProtoId for ${componentName}: ${protoId}`); // Debugging line

            // Use the name for the page and handle null protoId
            fs.writeFileSync(filePath, pageTemplate(componentData.name, protoId));
            createdCount++;
        } else {
            console.log(`No data found for component: ${componentName}`);
        }
    }
});

console.log(`\nProcess completed!`);
console.log(`Created ${createdCount} new component pages`);
console.log(`Pages are located in: ${pagesDir}`);