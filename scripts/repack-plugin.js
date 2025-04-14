const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const pluginDir = path.join(__dirname, '..', '_figma_plugin');
const outputZipPath = path.join(__dirname, '..', '_figma_plugin.zip');
const filesToInclude = ['code.js', 'manifest.json', 'ui.html'];

// Ensure the output directory exists (though in this case it's the root)
const outputDir = path.dirname(outputZipPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Create a file to stream archive data to.
const output = fs.createWriteStream(outputZipPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

// Listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function() {
  console.log(`Successfully created ${path.basename(outputZipPath)}: ${archive.pointer()} total bytes`);
});

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function() {
  console.log('Data has been drained');
});

// Good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // log warning
    console.warn('Warning:', err);
  } else {
    // throw error
    throw err;
  }
});

// Good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files from the _figma_plugin directory
filesToInclude.forEach(fileName => {
    const filePath = path.join(pluginDir, fileName);
    if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: fileName });
        console.log(`Adding ${fileName}`);
    } else {
        console.warn(`Warning: File not found and will not be included in the zip: ${filePath}`);
    }
});


// Finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize(); 