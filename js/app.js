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

function initializeImageSliders() {
   // Select all image sliders in the current content
   const sliders = document.querySelectorAll('.image-slider');

   sliders.forEach(slider => {
      // Ensure we don't initialize a slider twice
      if (slider.dataset.initialized) return;

      const images = slider.querySelectorAll('.slider-image');
      const prevBtn = slider.querySelector('.slider-nav.prev');
      const nextBtn = slider.querySelector('.slider-nav.next');
      const indicators = slider.querySelectorAll('.indicator');

      let currentIndex = 0;

      // Ensure at least one image exists before setting up
      if (images.length === 0) return;

      // Initially hide all images except the first
      images.forEach((img, index) => {
         img.style.opacity = index === 0 ? '1' : '0';
         img.style.position = index === 0 ? 'relative' : 'absolute';
         img.style.top = '0';
         img.style.left = '0';
         img.style.width = '100%';
      });

      // Set up indicators if they exist
      if (indicators.length > 0) {
         indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
               showSlide(index);
            });
         });
      }

      function showSlide(index) {
         // Normalize the index
         const normalizedIndex = (index + images.length) % images.length;

         // Hide current slide
         images[currentIndex].style.opacity = '0';
         images[currentIndex].style.position = 'absolute';

         // Show new slide
         images[normalizedIndex].style.opacity = '1';
         images[normalizedIndex].style.position = 'relative';

         // Update indicators if they exist
         if (indicators.length > 0) {
            indicators[currentIndex].classList.remove('active');
            indicators[normalizedIndex].classList.add('active');
         }

         // Update current index
         currentIndex = normalizedIndex;
      }

      // Set up navigation buttons if they exist
      if (prevBtn) {
         prevBtn.addEventListener('click', () => {
            showSlide(currentIndex - 1);
         });
      }

      if (nextBtn) {
         nextBtn.addEventListener('click', () => {
            showSlide(currentIndex + 1);
         });
      }

      // Mark as initialized to prevent duplicate setup
      slider.dataset.initialized = 'true';
   });
}

// Function to add event listeners to category items with proper active check
function addCategoryItemListeners() {
   document.querySelectorAll('.category-item').forEach(item => {
      item.addEventListener('click', (e) => {
         e.preventDefault();

         // Check if the clicked item is already active
         if (item.classList.contains('active')) {
            // If already active, do nothing and return
            console.log('Item already active, skipping reload');

            // Still close sidebar on mobile if needed
            closeSidebarOnMobile();
            return;
         }

         // Remove active class from all items
         document.querySelectorAll('.category-item').forEach(i => {
            i.classList.remove('active');
         });

         // Add active class to clicked item
         item.classList.add('active');

         // Get page name
         const pageName = item.getAttribute('data-page');

         // Load the content
         loadContent(pageName);

         // Scroll to top
         scrollToTop();

         // Close sidebar on mobile
         closeSidebarOnMobile();
      });
   });
}