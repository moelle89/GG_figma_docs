// bump-version.js
const fs = require('fs');
const path = require('path');

// --- Configuration ---
// Adjust these paths relative to your project root
const versionFilePath = path.join('_figma_plugin', 'plugin-updates', 'latest_version.json');
const codeJsFilePath = path.join('_figma_plugin', 'code.js');
// --- End Configuration ---

const absoluteVersionFilePath = path.resolve(versionFilePath);
const absoluteCodeJsFilePath = path.resolve(codeJsFilePath);

console.log(`Attempting to read version file: ${absoluteVersionFilePath}`);

fs.readFile(absoluteVersionFilePath, 'utf8', (err, data) => {
   if (err) {
      console.error(`Error reading version file at ${absoluteVersionFilePath}:`, err);
      process.exit(1); // Exit with error code
   }

   let versionData;
   try {
      versionData = JSON.parse(data);
   } catch (parseErr) {
      console.error(`Error parsing JSON from ${absoluteVersionFilePath}:`, parseErr);
      process.exit(1);
   }

   if (!versionData.latestVersion) {
      console.error(`Error: 'latestVersion' field not found in ${absoluteVersionFilePath}.`);
      process.exit(1);
   }

   const currentVersion = versionData.latestVersion;
   const versionParts = currentVersion.split('.');

   if (versionParts.length !== 3) {
      console.error(`Error: Invalid version format "${currentVersion}". Expected "major.minor.patch".`);
      process.exit(1);
   }

   let [major, minor, patch] = versionParts.map(Number);

   if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
      console.error(`Error: Version "${currentVersion}" contains non-numeric parts.`);
      process.exit(1);
   }

   // Increment the patch version
   patch += 1;

   const newVersion = `${major}.${minor}.${patch}`;

   console.log(`Bumping version from ${currentVersion} to ${newVersion}`);

   // Update the version data object
   versionData.latestVersion = newVersion;

   // Convert back to JSON string with pretty printing (2 spaces indentation)
   const updatedJsonData = JSON.stringify(versionData, null, 2);

   // Write the updated data back to the file
   fs.writeFile(absoluteVersionFilePath, updatedJsonData + '\n', 'utf8', (writeErr) => { // Add newline at end
      if (writeErr) {
         console.error(`Error writing updated version file to ${absoluteVersionFilePath}:`, writeErr);
         process.exit(1);
      }
      console.log(`Successfully updated ${versionFilePath} to version ${newVersion}`);

      // Now update the version in code.js
      console.log(`Attempting to update version in ${codeJsFilePath}...`);
      fs.readFile(absoluteCodeJsFilePath, 'utf8', (codeJsErr, codeJsData) => {
         if (codeJsErr) {
            console.error(`Error reading file ${absoluteCodeJsFilePath}:`, codeJsErr);
            process.exit(1);
         }

         // Replace the version in code.js
         const versionRegex = /(const CURRENT_PLUGIN_VERSION = ")([0-9]+\.[0-9]+\.[0-9]+)(")/;
         const updatedCodeJs = codeJsData.replace(versionRegex, `$1${newVersion}$3`);

         // Check if the version was actually replaced
         if (updatedCodeJs === codeJsData) {
            console.warn(`Warning: Could not find or replace version in ${codeJsFilePath}`);
            return;
         }

         // Write the updated code.js file
         fs.writeFile(absoluteCodeJsFilePath, updatedCodeJs, 'utf8', (codeJsWriteErr) => {
            if (codeJsWriteErr) {
               console.error(`Error writing updated version to ${absoluteCodeJsFilePath}:`, codeJsWriteErr);
               process.exit(1);
            }
            console.log(`Successfully updated version in ${codeJsFilePath} to ${newVersion}`);
         });
      });
   });
});