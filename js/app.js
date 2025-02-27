// Function to export component repository as downloadable JSON file
function exportComponentRepository() {
   // Convert the component repository to a JSON string
   const jsonData = JSON.stringify(componentRepository, null, 2);

   // Create a Blob containing the JSON data
   const blob = new Blob([jsonData], { type: 'application/json' });

   // Create a URL for the blob
   const url = URL.createObjectURL(blob);

   // Create a temporary link element
   const link = document.createElement('a');
   link.href = url;
   link.download = 'component-data.json';

   // Append the link to the body
   document.body.appendChild(link);

   // Programmatically click the link to trigger the download
   link.click();

   // Clean up
   document.body.removeChild(link);
   URL.revokeObjectURL(url);

   console.log('Component repository exported to file');
}

// Function to import component repository from a JSON file
function importComponentRepository() {
   // Create a file input element
   const fileInput = document.createElement('input');
   fileInput.type = 'file';
   fileInput.accept = '.json';

   // Handle file selection
   fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];

      if (file) {
         const reader = new FileReader();

         reader.onload = (e) => {
            try {
               // Parse the JSON data
               const importedData = JSON.parse(e.target.result);

               // Update the component repository
               Object.assign(componentRepository, importedData);

               // Save to localStorage as backup
               localStorage.setItem('componentRepository', JSON.stringify(componentRepository));

               console.log('Component repository imported from file');
               alert('Component data imported successfully!');

               // Refresh the component manager if it's open
               if (document.querySelector('.component-manager')) {
                  createComponentManager();
               }
            } catch (error) {
               console.error('Error parsing imported data:', error);
               alert('Error importing component data. Please ensure the file contains valid JSON.');
            }
         };

         reader.readAsText(file);
      }
   });

   // Programmatically click the file input
   document.body.appendChild(fileInput);
   fileInput.click();
   document.body.removeChild(fileInput);
}