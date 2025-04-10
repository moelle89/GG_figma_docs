const fs = require('fs');
const path = require('path');

// Path to relevant files
const componentsFilePath = path.join(__dirname, '../data/components.json');
const menuFilePath = path.join(__dirname, '../data/menu.json');
const figmaPluginCodePath = path.join(__dirname, '../_figma_plugin/code.js');
const newLinksFilePath = path.join(__dirname, '../data/new_links.json');
const componentLinksDirPath = path.join(__dirname, '../data/component_links'); // Directory for exported .url files

// Load existing components data
const componentsData = JSON.parse(fs.readFileSync(componentsFilePath, 'utf8'));

// Load menuData from data/menu.json
let menuData = [];

// Read and parse menuData from menu.json
try {
   const menuFileContent = fs.readFileSync(menuFilePath, 'utf8');
   menuData = JSON.parse(menuFileContent);
} catch (error) {
   console.error('Error reading menu.json:', error);
   process.exit(1);
}

// Function to update the Figma plugin's code.js with menu data from menu.json
function updateFigmaPluginMenuData() {
   console.log('Updating Figma plugin menu data...');

   try {
      // Read the code.js file
      let codeJsContent = fs.readFileSync(figmaPluginCodePath, 'utf8');

      // Create a string representation of the menu data with proper formatting
      const menuDataString = JSON.stringify(menuData, null, 2)
         .replace(/^/gm, '  ') // Add 2 spaces at the beginning of each line for indentation
         .replace(/\n$/, '');   // Remove the last newline

      // Regular expression to find the defaultMenuData array
      const menuDataRegex = /(const\s+defaultMenuData\s*=\s*)\[[\s\S]*?\];/;

      // Replace the entire defaultMenuData array with the new menu data
      const updatedCodeJs = codeJsContent.replace(
         menuDataRegex,
         `$1${menuDataString};`
      );

      // Write the updated code back to code.js
      fs.writeFileSync(figmaPluginCodePath, updatedCodeJs);

      console.log('Successfully updated Figma plugin menu data in code.js');
   } catch (error) {
      console.error('Error updating Figma plugin menu data:', error);
   }
}

// Function to update components.json with new items and links
function updateComponents() {
   let changesMade = false; // Flag to track if any changes were made
   let linkFiles = {}; // Store found link files { 'component-name.url': 'url content' }
   let usedLinkFiles = new Set(); // Keep track of link files that were actually used

   // --- Check for and load link files from component_links directory ---
   if (fs.existsSync(componentLinksDirPath)) {
       console.log(`Found ${componentLinksDirPath}, processing link files...`);
       try {
           const files = fs.readdirSync(componentLinksDirPath);
           files.forEach(file => {
               if (path.extname(file) === '.url') {
                   const filePath = path.join(componentLinksDirPath, file);
                   const urlContent = fs.readFileSync(filePath, 'utf8').trim();
                   if (urlContent) {
                       linkFiles[file] = urlContent;
                   } else {
                       console.warn(`Warning: Link file ${file} is empty.`);
                   }
               }
           });
           console.log(`Loaded ${Object.keys(linkFiles).length} URLs from link files.`);
       } catch (error) {
           console.error(`Error reading directory ${componentLinksDirPath}:`, error);
       }
   }
   // --- End loading link files ---

   // --- Remove old new_links.json processing logic (kept for reference, now commented out) ---
   /*
   if (fs.existsSync(newLinksFilePath)) {
       console.log('Found new_links.json, processing...');
       // ... (old logic using new_links.json)
       fs.unlinkSync(newLinksFilePath);
       console.log('Deleted new_links.json');
   }
   */
   // --- End remove old logic ---

   // --- Process existing componentsData for missing links ---
   Object.keys(componentsData).forEach(itemKey => {
       const component = componentsData[itemKey];
       // Check if the figmaLink is empty
       if (component.figmaLink === "") {
           // Sanitize name to find corresponding .url file
           const linkFilenameBase = component.name
               .replace(/❖\s*/, '') // Remove prefix if present
               .replace(/\s+/g, '-') // Replace spaces with hyphens
               .toLowerCase()
               .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric/non-hyphen
               .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
           const linkFilename = `${linkFilenameBase || 'component'}.url`;

           if (linkFiles[linkFilename]) {
               component.figmaLink = linkFiles[linkFilename];
               console.log(`Updated figmaLink for existing component: ${component.name}`);
               changesMade = true; // Mark that a change was made
               usedLinkFiles.add(linkFilename); // Mark this file as used
           }
       }
   });
   // --- End processing existing components ---

   // --- Process new items from menuData ---
   menuData.forEach(category => {
      category.items.forEach(item => {
         const itemKey = item.toLowerCase().replace(/\s+/g, '-'); // Create a key from the item name

         // Check if the item already exists in componentsData
         if (!componentsData[itemKey]) {
            // --- Find link from loaded linkFiles ---
            let linkUrl = "";
            // Sanitize item name to find corresponding .url file
            const linkFilenameBase = item
                .replace(/❖\s*/, '') // Remove prefix if present
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric/non-hyphen
                .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
            const linkFilename = `${linkFilenameBase || 'component'}.url`;

            if (linkFiles[linkFilename]) {
                linkUrl = linkFiles[linkFilename];
                usedLinkFiles.add(linkFilename); // Mark this file as used
            }
            // --- End find link ---

            const newComponent = {
               "name": item,
               "description": "",
               "figmaLink": linkUrl, // Use the found linkUrl from file
               "figmaProto": "",
               "figmaButtonText": item,
               "imagePath1": "assets/prop_table/empty.png",
               "imagePath2": "assets/prop_table/empty.png",
               "nestedComponents": []
            };
            componentsData[itemKey] = newComponent;
            changesMade = true; // Mark that a change was made
            console.log(`Added new item: ${item}` + (newComponent.figmaLink ? ' with figmaLink.' : '.'));
         }
      });
   });
   // --- End processing new items ---

   // --- Delete processed link files ---
   if (usedLinkFiles.size > 0) { // Check if the Set has any used files
       console.log('Deleting used link files...');
       usedLinkFiles.forEach(file => { // Iterate over the Set of used files
           const filePath = path.join(componentLinksDirPath, file);
           try {
               fs.unlinkSync(filePath);
               console.log(`Deleted ${file}`);
           } catch (err) {
               console.error(`Error deleting file ${filePath}:`, err);
           }
       });
   } else if (Object.keys(linkFiles).length > 0) {
       console.log('No link files were used in this run.');
   }
   // --- End deleting link files ---

   // Write the updated components data back to components.json only if changes were made
   if (changesMade) {
      fs.writeFileSync(componentsFilePath, JSON.stringify(componentsData, null, 4));
      console.log('components.json has been updated with new items and/or links.');
   } else {
      console.log('No new items added or links updated.');
   }
}

// Run both update functions
updateComponents();
updateFigmaPluginMenuData();