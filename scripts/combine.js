const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inputDir = path.join(__dirname, '../assets/_ts_props/src'); // Updated path
const outputFile = path.join(__dirname, '../assets/_ts_props/dist', 'combined.json'); // Updated path
const cleanJsonScript = path.join(__dirname, '../assets/_ts_props/clean_json.py'); // Updated path for Python script

// Ensure output directory exists
if (!fs.existsSync(path.dirname(outputFile))) {
   fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

// Clear the output file
fs.writeFileSync(outputFile, '');

// Loop through all .ts files and append their contents
const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.ts'));
files.forEach(file => {
   const filePath = path.join(inputDir, file);
   fs.appendFileSync(outputFile, `// File: ${filePath}\n`);
   const content = fs.readFileSync(filePath, 'utf-8');
   fs.appendFileSync(outputFile, content + '\n\n');
});

console.log(`Combined TypeScript files into ${outputFile}`);

// Run the Python script to clean the combined JSON
execSync(`python "${cleanJsonScript}"`, { stdio: 'inherit' });