const fs = require('fs');
const path = require('path');

// Path to relevant files
const componentsFilePath = path.join(__dirname, '../data/components.json');
const menuFilePath = path.join(__dirname, '../data/menu.json');
const figmaPluginCodePath = path.join(__dirname, '../_figma_plugin/code.js');
const newLinksFilePath = path.join(__dirname, '../data/new_links.json');

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
   let newLinksData = {};

   // --- Check for and process new_links.json ---
   if (fs.existsSync(newLinksFilePath)) {
       console.log('Found new_links.json, processing...');
       try {
           const newLinksFileContent = fs.readFileSync(newLinksFilePath, 'utf8');
           newLinksData = JSON.parse(newLinksFileContent);
           console.log(`Loaded ${Object.keys(newLinksData).length} links from new_links.json.`);

           // Iterate through existing componentsData to update links
           Object.keys(componentsData).forEach(itemKey => {
               const component = componentsData[itemKey];
               // Check if the component name exists in newLinksData and if the current figmaLink is empty
               if (newLinksData[component.name] && component.figmaLink === "") {
                   component.figmaLink = newLinksData[component.name];
                   console.log(`Updated figmaLink for: ${component.name}`);
                   changesMade = true; // Mark that a change was made
               }
           });

           // Delete the new_links.json file after processing
           fs.unlinkSync(newLinksFilePath);
           console.log('Deleted new_links.json');

       } catch (error) {
           console.error('Error processing new_links.json:', error);
           // Don't exit, continue with adding new items if possible
       }
   }
   // --- End processing new_links.json ---

   // --- Process new items from menuData ---
   menuData.forEach(category => {
      category.items.forEach(item => {
         const itemKey = item.toLowerCase().replace(/\s+/g, '-'); // Create a key from the item name

         // Check if the item already exists in componentsData
         if (!componentsData[itemKey]) {
            // Create a new data set for the item
            const newComponent = {
               "name": item,
               "description": "",
               "figmaLink": newLinksData[item] || "", // Use link from newLinksData if available
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