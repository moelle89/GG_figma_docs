// bump-version.js
const fs = require('fs');
const path = require('path');

// --- Configuration ---
// Adjust this path relative to your project root where package.json is
const versionFilePath = path.join('_figma_plugin', 'plugin-updates', 'latest_version.json');
// --- End Configuration ---

const absoluteVersionFilePath = path.resolve(versionFilePath);

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
   });
});