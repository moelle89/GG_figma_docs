const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../pages');

const playgroundWrapper = `<div class="playground__container">
    <div class="playground__tabs">
        <button class="playground__tab" data-tab="figma">figma</button>
        <button class="playground__tab" data-tab="how-to use">how-to use</button>
        <span style="flex: 1"></span>
        <button class="playground__tab playground__tab--secondary" data-tab="ios">iOS</button>
        <button class="playground__tab playground__tab--secondary" data-tab="md">MD</button>
    </div>
    <div class="playground__content" data-content="figma">
        {{fig-container}}
    </div>
    <div class="playground__content" data-content="how-to use">
        <!-- JavaScript content -->
    </div>
    <div class="playground__content" data-content="ios">
        <!-- iOS content -->
    </div>
    <div class="playground__content" data-content="md">
        <!-- MD content -->
    </div>
</div>`;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has playground container
    if (content.includes('playground__container')) {
        console.log(`Skipping ${filePath} - already has playground container`);
        return;
    }

    // Find fig-container and wrap it
    if (content.includes('fig-container')) {
        const figContainerRegex = /<div class="fig-container">([\s\S]*?)<\/div>/g;
        content = content.replace(figContainerRegex, (match) => {
            return playgroundWrapper.replace('{{fig-container}}', match);
        });

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

// Process all HTML files in pages directory
fs.readdirSync(pagesDir).forEach(file => {
    if (file.endsWith('.html')) {
        processFile(path.join(pagesDir, file));
    }
});

console.log('Done processing files');