// Add click handler for the export names & IDs button
document.addEventListener('DOMContentLoaded', function() {
    const exportNamesIdsButton = document.getElementById('export-names-ids-button');
    if (exportNamesIdsButton) {
        exportNamesIdsButton.addEventListener('click', function() {
            const button = this;
            const originalText = button.textContent;

            if (!window.currentLinksData || window.currentLinksData.length === 0) {
                console.warn("No elements to export names and IDs.");
                return;
            }

            button.disabled = true;
            button.textContent = 'Generating...';

            try {
                // Create the JSON object in the requested format
                const jsonData = {};
                
                window.currentLinksData.forEach(item => {
                    // Extract the ID without the node- prefix if it exists
                    const idValue = item.id.replace(/^node-/, '');
                    
                    // Use the name as the key and create an object with id property
                    const name = item.name || 'unnamed';
                    jsonData[name] = { "id": idValue };
                });
                
                // Convert to JSON string with 2-space indentation
                const jsonString = JSON.stringify(jsonData, null, 2);
                
                // Download the JSON file
                window.downloadFile("figma_element_ids.json", jsonString, "application/json");
                
                button.textContent = 'Exported!';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 2000);
            } catch (error) {
                console.error("Error generating JSON data:", error);
                button.textContent = 'Error';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 3000);
            }
        });
    } else {
        console.error("Export Names & IDs button not found in the DOM");
    }
}); 