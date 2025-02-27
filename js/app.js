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

// Function to import component data from a user-selected file
function importComponentRepository() {
   // Create a file input element
   const fileInput = document.createElement('input');
   fileInput.type = 'file';
   fileInput.accept = '.json';

   // When a file is selected
   fileInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
         try {
            const data = JSON.parse(e.target.result);

            // Merge imported data with existing repository
            Object.assign(componentRepository, data);

            // Save to localStorage
            localStorage.setItem('componentRepository', JSON.stringify(componentRepository));

            // Update the component select dropdown
            const componentSelect = document.getElementById('component-select');
            if (componentSelect) {
               componentSelect.innerHTML = `
                        <option value="">-- Select a component --</option>
                        ${Object.keys(componentRepository).map(key =>
                  `<option value="${key}">${componentRepository[key].name}</option>`
               ).join('')}
                    `;
            }

            alert('Component data imported successfully!');
         } catch (error) {
            console.error('Error parsing imported file:', error);
            alert('Error importing file. Please make sure it is a valid JSON file.');
         }
      };

      reader.readAsText(file);
   });

   // Trigger the file selection dialog
   fileInput.click();
}