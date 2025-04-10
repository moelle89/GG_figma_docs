const fs = require('fs');
const path = require('path');

// Path to relevant files
const componentsFilePath = path.join(__dirname, '../data/components.json');
const menuFilePath = path.join(__dirname, '../data/menu.json');
const figmaPluginCodePath = path.join(__dirname, '../_figma_plugin/code.js');

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

// Function to update components.json with new items
function updateComponents() {
   let newItemsAdded = false;

   menuData.forEach(category => {
      category.items.forEach(item => {
         const itemKey = item.toLowerCase().replace(/\s+/g, '-'); // Create a key from the item name

         // Check if the item already exists in componentsData
         if (!componentsData[itemKey]) {
            // Create a new data set for the item
            componentsData[itemKey] = {
               "name": item,
               "description": "",
               "figmaLink": "",
               "figmaProto": "",
               "figmaButtonText": item,
               "imagePath1": "assets/prop_table/empty.png",
               "imagePath2": "assets/prop_table/empty.png",
               "nestedComponents": []
            };
            newItemsAdded = true;
            console.log(`Added new item: ${item}`);
         }
      });
   });

   // Write the updated components data back to components.json if new items were added
   if (newItemsAdded) {
      fs.writeFileSync(componentsFilePath, JSON.stringify(componentsData, null, 4));
      console.log('components.json has been updated.');
   } else {
      console.log('No new items to add.');
   }
}

// Run both update functions
updateComponents();
updateFigmaPluginMenuData();