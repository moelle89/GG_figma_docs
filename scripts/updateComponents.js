const fs = require('fs');
const path = require('path');

// Load existing components data
const componentsFilePath = path.join(__dirname, '../data/components.json');
const componentsData = JSON.parse(fs.readFileSync(componentsFilePath, 'utf8'));

// Load menuData from index.html
const indexFilePath = path.join(__dirname, '../index.html');
const indexFileContent = fs.readFileSync(indexFilePath, 'utf8');

// Extract menuData using a regular expression
const menuDataMatch = indexFileContent.match(/const menuData = (\[.*?\]);/s);
let menuData = [];

if (menuDataMatch && menuDataMatch[1]) {
   menuData = JSON.parse(menuDataMatch[1]);
} else {
   console.error('menuData not found in index.html');
   process.exit(1);
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
               "imagePath2": "assets/prop_table/empty.png"
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

// Run the update function
updateComponents();