function createComponentManager() {
   const managerHtml = `
    <div class="component-manager">
        <h2>Component Data Manager</h2>
        <p class="has-opacity">Use this tool to manage component descriptions, Figma links, and images.</p>

        <div class="info-box">
            <h3>How Data Storage Works</h3>
            <p class="has-opacity">Data is loaded from <code>data/components.json</code> when the page loads.</p>
            <p class="has-opacity">Changes you make here are saved to your browser's local storage temporarily.</p>
            <p class="has-opacity">To permanently save changes, click "Export Data" and replace your project's components.json file with the downloaded file.</p>
        </div>

        <div class="data-actions">
            <button id="export-components" class="export-button">Export Data (components.json)</button>
            <button id="import-components" class="import-button">Import Data</button>
        </div>

        <div class="component-selector">
            <label for="component-select">Select Component:</label>
            <select id="component-select" class="component-select">
                <option value="">-- Select a component --</option>
                ${Object.keys(componentRepository).map(key =>
      `<option value="${key}">${componentRepository[key].name}</option>`
   ).join('')}
            </select>
        </div>

        <div class="component-form" id="component-form" style="display: none;">
            <div class="form-group">
                <label for="component-name">Component Name:</label>
                <input type="text" id="component-name" class="form-input">
            </div>

            <div class="form-group">
                <label for="component-description">Description:</label>
                <textarea id="component-description" class="form-textarea" rows="4"></textarea>
            </div>

            <div class="form-group">
                <label for="component-figma-link">Figma Link:</label>
                <input type="text" id="component-figma-link" class="form-input">
            </div>

            <div class="form-group">
                <label for="component-button-text">Button Text:</label>
                <input type="text" id="component-button-text" class="form-input">
            </div>

            <div class="form-group">
                <label for="component-image-path1">Image Path 1:</label>
                <input type="text" id="component-image-path1" class="form-input" placeholder="e.g., assets/prop_table/component_name.jpg">
            </div>

            <div class="form-group">
                <label for="component-image-path2">Image Path 2:</label>
                <input type="text" id="component-image-path2" class="form-input" placeholder="e.g., assets/img/component_name.jpg">
            </div>

            <div class="form-actions">
                <button id="save-component" class="save-button">Save Component Data</button>
            </div>
        </div>
    </div>
`;

   contentContainer.innerHTML = managerHtml;

   // Add event listeners
   const componentSelect = document.getElementById('component-select');
   const componentForm = document.getElementById('component-form');
   const componentName = document.getElementById('component-name');
   const componentDescription = document.getElementById('component-description');
   const componentFigmaLink = document.getElementById('component-figma-link');
   const componentButtonText = document.getElementById('component-button-text');
   const componentImagePath1 = document.getElementById('component-image-path1');
   const componentImagePath2 = document.getElementById('component-image-path2');
   const saveButton = document.getElementById('save-component');
   const exportButton = document.getElementById('export-components');
   const importButton = document.getElementById('import-components');

   // Handle component selection
   componentSelect.addEventListener('change', function () {
      const selectedKey = this.value;

      if (selectedKey) {
         const data = componentRepository[selectedKey];

         // Populate form
         componentName.value = data.name || '';
         componentDescription.value = data.description || '';
         componentFigmaLink.value = data.figmaLink || '';
         componentButtonText.value = data.figmaButtonText || '';
         componentImagePath1.value = data.imagePath1 || '';
         componentImagePath2.value = data.imagePath2 || '';

         // Show form
         componentForm.style.display = 'block';
      } else {
         // Hide form if no component selected
         componentForm.style.display = 'none';
      }
   });

   // Handle save button
   saveButton.addEventListener('click', function () {
      const selectedKey = componentSelect.value;

      if (selectedKey) {
         // Update repository
         componentRepository[selectedKey] = {
            name: componentName.value,
            description: componentDescription.value,
            figmaLink: componentFigmaLink.value,
            figmaButtonText: componentButtonText.value,
            imagePath1: componentImagePath1.value,
            imagePath2: componentImagePath2.value
         };

         // Save to localStorage
         localStorage.setItem('componentRepository', JSON.stringify(componentRepository));

         // Provide feedback
         alert(`Component "${componentName.value}" data saved to local storage. To permanently save this data, click "Export Data".`);
      }
   });

   // Add export/import functionality
   exportButton.addEventListener('click', saveComponentRepository);
   importButton.addEventListener('click', importComponentRepository);
}

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

function copyToClipboard(text) {
   const textarea = document.createElement('textarea');
   textarea.value = text;
   document.body.appendChild(textarea);
   textarea.select();
   document.execCommand('copy');
   document.body.removeChild(textarea);
}

function showToast(message) {
   const toast = document.getElementById('toast');
   toast.textContent = message;
   toast.classList.add('show');
   setTimeout(() => {
      toast.classList.remove('show');
   }, 2000);
}

function loadSocialIcons() {
   const iconContainer = document.getElementById('other-icons');
   const suffixes = [
      '_white',
      '_white_circle',
      '_gray',
      '_gray_circle',
      '_color',
      '_color_circle'
   ];



   // Add section title
   const sectionTitle = document.createElement('h2');
   sectionTitle.className = 'section-title';
   sectionTitle.id = 'social-icons';
   sectionTitle.innerHTML = '❖ Social-Icons:';
   iconContainer.appendChild(sectionTitle);

   // Create main grid container
   const gridContainer = document.createElement('div');
   gridContainer.className = 'social-icons-grid';
   // Create sections for each suffix
   suffixes.forEach(suffix => {
      const sectionContainer = document.createElement('div');
      sectionContainer.className = 'icon-section';

      // Add section title
      const sectionTitle = document.createElement('h3');
      sectionTitle.className = 'section-title';
      sectionTitle.textContent = suffix.replace(/_/g, ' ').toUpperCase();
      sectionContainer.appendChild(sectionTitle);

      // Create grid for icons
      const iconGrid = document.createElement('div');
      iconGrid.className = 'icon-grid';

      // Add icons to grid
      const icons = [
         'facebook',
         'twitter',
         'instagram',
         'linkedin',
         'youtube',
         'pinterest',
         'tiktok',
         'snapchat'
      ];

      icons.forEach(icon => {
         const iconWrapper = document.createElement('div');
         iconWrapper.className = 'icon-wrapper';

         const img = document.createElement('img');
         img.src = `assets/icons/social_icons/${icon}${suffix}.png`;
         img.alt = `${icon}${suffix}`;
         img.className = 'social-icon';

         const label = document.createElement('span');
         label.className = 'icon-label';
         label.textContent = icon;

         // Add click event to copy label text
         iconWrapper.onclick = () => {
            copyToClipboard(icon);
            showToast(`${icon} copied to clipboard!`);
         };

         iconWrapper.appendChild(img);
         iconGrid.appendChild(iconWrapper);
      });

      sectionContainer.appendChild(iconGrid);
      gridContainer.appendChild(sectionContainer);
   });

   // Add the grid to the container
   iconContainer.appendChild(gridContainer);
}

function loadPaymentIcons() {
   const iconContainer = document.getElementById('other-icons');

   // Add section title
   const sectionTitle = document.createElement('h2');
   sectionTitle.className = 'section-title';
   sectionTitle.id = 'payment-icons';
   sectionTitle.innerHTML = '❖ Payments:';
   iconContainer.appendChild(sectionTitle);

   const gridContainer = document.createElement('div');
   gridContainer.className = 'payment-icons-grid';

   const paymentIcons = [
      'affirm', 'alipay', 'amazon', 'amex', 'applepay', 'bancontact', 'bitcoin', 'bitcoincash', 'bitpay', 'citadele', 'dinersclub', 'discover', 'elo', 'etherium', 'giropay', 'googlepay', 'ideal', 'interac', 'jcb', 'klarna', 'lightcoin', 'maestro', 'mastercard', 'payoneer', 'paypal', 'paysafe', 'qiwi', 'sepa', 'shop pay', 'skrill', 'sofort', 'stripe', 'unionpay', 'verifone', 'visa', 'webmoney', 'wechat', 'yandex'

   ];

   paymentIcons.forEach(icon => {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'icon-wrapper';

      const img = document.createElement('img');
      img.src = `assets/icons/payments/${icon}.png`;
      img.alt = icon;
      img.className = 'payment-icon';

      const label = document.createElement('span');
      label.className = 'icon-label';
      label.textContent = icon.replace(/_/g, ' ');

      // Add click event to copy label text
      iconWrapper.onclick = () => {
         copyToClipboard(icon);
         showToast(`${icon} copied to clipboard!`);
      };

      iconWrapper.appendChild(img);
      iconWrapper.appendChild(label);
      gridContainer.appendChild(iconWrapper);
   });

   iconContainer.appendChild(gridContainer);
}

function loadAppIcons() {
   const iconContainer = document.getElementById('other-icons');

   // Add section title for Apps
   const sectionTitle = document.createElement('h2');
   sectionTitle.className = 'section-title';
   sectionTitle.id = 'app-icons';
   sectionTitle.innerHTML = '❖ App Icons:';
   iconContainer.appendChild(sectionTitle);

   const categories = {
      browsers: ['chrome', 'edge', 'firefox', 'ie', 'opera', 'safari', 'tor', 'uc', 'yandex'],
      coding: ['adobe_dreamweaver', 'angular', 'atom', 'bitbucket', 'csharp', 'c++', 'codepen', 'css_3', 'docker', 'drupal', 'git', 'go', 'html_5', 'java', 'jb_appcode', 'jb_clion', 'jb_datagrip', 'jb_dotcover', 'jb_dotmemory', 'jb_dotpeek', 'jb_dottrace', 'jb_goland', 'jb_hub', 'jb_IntelliJ IDEA', 'jb_kotlin', 'jb_phpstorm', 'jb_pycharm', 'jb_pycharm_edu', 'jb_resharper', 'jb_resharper_c++', 'jb_rider', 'jb_rubymine', 'jb_teamcity', 'jb_toolbox_app', 'jb_upsource', 'jb_webstorm', 'jb_youtrack', 'joomla', 'jquery', 'js', 'node_js', 'npm', 'php', 'python', 'react', 'redux', 'ruby', 'r_lang', 'sublime_text', 'swift', 'vs_code', 'vue', 'weebly', 'wordpress', 'yii 1'],
      design: ['acrobat-reader', 'adobe', 'adobe_aero', 'adobe_after_effects', 'adobe_animate', 'adobe_creative-cloud', 'adobe_dimension', 'adobe_fill-and-sign', 'adobe_illustrator', 'adobe_incopy', 'adobe_indesign', 'adobe_lightroom', 'adobe_photoshop-camera', 'adobe_photoshop-express', 'adobe_photoshop', 'adobe_premiere-rush', 'adobe_premiere', 'adobe_spark', 'adobe_stock', 'adobe_xd', 'autodesk', 'behance', 'dribbble', 'figma', 'framer', 'invision', 'marvel', 'procreate', 'sketch', 'zeplin'],
      messengers: ['discord', 'facetime', 'fb_messenger', 'google meet', 'google_hangouts', 'kakao_talk', 'line', 'messages', 'ms_skype', 'slack', 'spectrum', 'telegram', 'viber', 'wechat', 'whatsapp', 'zoom'],
      money: ['alfa_bank', 'american_express', 'direct_debit', 'jcb', 'mastercard', 'paypal', 'qiwi', 'sberbank', 'shopify', 'stripe', 'swift', 'tinkoff', 'visa', 'webmoney', 'western_union', 'world_pay', 'yandex_kassa'],
      music: ['apple_music', 'audition', 'google_play_music', 'grooveshark', 'shazam', 'sound_cloud', 'spotify', 'yandex_music', 'youtube_music'],
      os: ['android', 'apple', 'blackberry', 'chrome_os', 'elementary', 'fedora', 'freebsd', 'gnome', 'ios', 'linux-mint', 'linux', 'macos', 'microsoft', 'ubuntu'],
      other: ['airbnb', 'amd', 'angel_list', 'app_store', 'bluetooth', 'dell', 'envato', 'general_electric', 'google', 'google_ads', 'google_play', 'huawei_app_gallery', 'ibm', 'intel', 'kickstarter', 'medium', 'ms_xbox', 'playstation', 'product_hunt', 'steam', 'stumble_upon', 'Taobao', 'tech_crunch', 'tripadvisor', 'yandex'],
      productivity: ['amazon', 'asana', 'atlassian', 'bamboo', 'basecamp', 'confluence', 'dropbox', 'evernote', 'finder', 'flowmapp', 'g-calendar', 'gmail', 'google docs', 'google maps', 'google meet', 'google-analytics', 'google_drive', 'hubspot', 'intercom', 'jira', 'jira_core', 'jira_ops', 'jira_service_desk', 'kayako', 'mailchimp', 'ms_excel', 'ms_onedrive', 'ms_onenote', 'ms_outlook', 'ms_powerpoint', 'ms_sharepoint', 'ms_word', 'ms_yammer', 'notion', 'opsgenie', 'salesforce', 'sourcetree', 'statuspage', 'teams', 'things', 'treehouse', 'trello', 'workflowy', 'zapier', 'zendesk'],
      'social-networks': ['askfm', 'badoo', 'Facebook', 'foursquare', 'instagram', 'linkedin', 'meta', 'OK', 'patreon', 'pinterest', 'quora', 'qzone', 'reddit', 'snapchat', 'stack_overflow', 'tiktok', 'tinder', 'tumbler', 'twitter', 'vk', 'weibo'],
      video: ['appearin', 'coub', 'flickr', 'igtv', 'netflix', 'twitch', 'vimeo', 'youtube']
   };

   const mainContainer = document.createElement('div');
   mainContainer.className = 'app-icons-container';

   for (const [category, icons] of Object.entries(categories)) {
      const categorySection = document.createElement('div');
      categorySection.className = 'category-section';

      // Add category title
      const categoryTitle = document.createElement('h3');
      categoryTitle.className = 'category-title';
      categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
      categorySection.appendChild(categoryTitle);

      // Create grid for this category
      const gridContainer = document.createElement('div');
      gridContainer.className = 'app-icons-grid';

      icons.forEach(icon => {
         const iconWrapper = document.createElement('div');
         iconWrapper.className = 'icon-wrapper';

         const img = document.createElement('img');
         img.src = `assets/icons/apps/${category}/${icon}.png`;
         img.alt = icon;
         img.className = 'app-icon';

         const label = document.createElement('span');
         label.className = 'icon-label';
         label.textContent = icon.replace(/_/g, ' ').replace(/jb_/g, '');

         // Add click event to copy label text
         iconWrapper.onclick = () => {
            copyToClipboard(icon);
            showToast(`${icon} copied to clipboard!`);
         };

         iconWrapper.appendChild(img);
         iconWrapper.appendChild(label);
         gridContainer.appendChild(iconWrapper);
      });

      categorySection.appendChild(gridContainer);
      mainContainer.appendChild(categorySection);
   }

   iconContainer.appendChild(mainContainer);
}

function loadEmojiIcons() {
   const iconContainer = document.getElementById('other-icons');

   // Add section title
   const sectionTitle = document.createElement('h2');
   sectionTitle.className = 'section-title';
   sectionTitle.id = 'emoji-icons';
   sectionTitle.innerHTML = '❖ Emoji Icons:';
   iconContainer.appendChild(sectionTitle);

   const gridContainer = document.createElement('div');
   gridContainer.className = 'emoji-icons-grid';

   const emojiIcons = [
      'Angry', 'Confused', 'Confusing-1', 'Confusing', 'Confusion',
      'Crying', 'Dead skin', 'Dead', 'Detective', 'Eye care',
      'Eye', 'Eyeem', 'Find', 'Flip', 'Haha',
      'Handsome', 'Hug', 'Kid', 'Laugh', 'Laughing',
      'Laughter', 'Love and romance', 'Nervous', 'Romance and love',
      'Romance', 'Sad face', 'Sad', 'Smiles', 'Spooky',
      'Star', 'Superstar', 'Tongue out', 'Tongue', 'Toxic',
      'Wow', 'Yelling'
   ];

   emojiIcons.forEach(icon => {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'icon-wrapper';

      const img = document.createElement('img');
      img.src = `assets/icons/emojis/${icon}.png`;
      img.alt = icon;
      img.className = 'emoji-icon';

      const label = document.createElement('span');
      label.className = 'icon-label';
      label.textContent = icon.replace(/-1/g, '').replace(/-/g, ' ');

      // Add click event to copy label text
      iconWrapper.onclick = () => {
         copyToClipboard(icon);
         showToast(`${icon} copied to clipboard!`);
      };

      iconWrapper.appendChild(img);
      iconWrapper.appendChild(label);
      gridContainer.appendChild(iconWrapper);
   });

   iconContainer.appendChild(gridContainer);
}

function loadFlagIcons() {
   const iconContainer = document.getElementById('other-icons');

   // Add section title
   const sectionTitle = document.createElement('h2');
   sectionTitle.className = 'section-title';
   sectionTitle.id = 'flag-icons';
   sectionTitle.innerHTML = '❖ Flag Icons:';
   iconContainer.appendChild(sectionTitle);

   const gridContainer = document.createElement('div');
   gridContainer.className = 'flag-icons-grid';

   const flagIcons = [
      'abkhazia', 'afghanistan', 'aland-islands', 'albania', 'algeria', 'american-samoa', 'andorra', 'angola', 'anguilla', 'antigua-and-barbuda', 'argentina', 'armenia', 'aruba', 'australia', 'austria', 'azerbaijan', 'azores-islands', 'bahamas', 'bahrain', 'balearic-islands', 'bangladesh', 'barbados', 'basque-country', 'belarus', 'belgium', 'belize', 'benin', 'bermuda', 'bhutan-1', 'bhutan', 'bolivia', 'bonaire', 'bosnia-and-herzegovina', 'botswana', 'brazil', 'british-columbia', 'british-indian-ocean-territory', 'british-virgin-islands', 'brunei', 'bulgaria', 'burkina-faso', 'burundi', 'cambodia', 'cameroon', 'canada', 'canary-islands', 'cape-verde', 'cayman-islands', 'central-african-republic', 'ceuta', 'chad', 'chile', 'china', 'christmas-island', 'cocos-island', 'colombia', 'comoros', 'cook-islands', 'corsica', 'costa-rica', 'croatia', 'cuba', 'curacao', 'cyprus', 'czech-republic', 'democratic-republic-of-congo', 'denmark', 'djibouti', 'dominica', 'dominican-republic', 'east-timor', 'ecuador', 'egypt', 'el-salvador', 'england', 'equatorial-guinea', 'eritrea', 'estonia', 'ethiopia', 'european-union', 'falkland-islands', 'faroe-islands', 'fiji', 'finland', 'france', 'french-polynesia', 'gabon', 'galapagos-islands', 'gambia', 'georgia', 'germany', 'ghana', 'gibraltar', 'greece', 'greenland', 'grenada', 'guam', 'guatemala', 'guernsey', 'guinea-bissau', 'guinea', 'guyana', 'haiti', 'hawaii', 'honduras', 'hong-kong', 'hungary', 'iceland', 'india', 'indonesia', 'iran', 'iraq', 'ireland', 'isle-of-man', 'israel', 'italy', 'ivory-coast', 'jamaica', 'japan', 'jersey', 'jordan', 'kazakhstan', 'kenya', 'kiribati', 'kosovo', 'kuwait', 'kyrgyzstan', 'laos', 'latvia', 'lebanon', 'lesotho', 'liberia', 'libya', 'liechtenstein', 'lithuania', 'luxembourg', 'macao', 'madagascar', 'madeira', 'malawi', 'malaysia', 'maldives', 'mali', 'malta', 'marshall-island', 'martinique', 'mauritania', 'mauritius', 'melilla', 'mexico', 'micronesia', 'moldova', 'monaco', 'mongolia', 'montenegro', 'montserrat', 'morocco', 'mozambique', 'myanmar', 'namibia', 'nato', 'nauru', 'nepal', 'netherlands', 'new-zealand', 'nicaragua', 'niger', 'nigeria', 'niue', 'norfolk-island', 'north-korea', 'northern-cyprus', 'northern-marianas-islands', 'norway', 'oman', 'orkney-islands', 'ossetia', 'pakistan', 'palau', 'palestine', 'panama', 'papua-new-guinea', 'paraguay', 'peru', 'philippines', 'pitcairn-islands', 'poland', 'portugal', 'puerto-rico', 'qatar', 'rapa-nui', 'republic-of-macedonia', 'republic-of-the-congo', 'romania', 'russia', 'rwanda', 'saba-island', 'sahrawi-arab-democratic-republic', 'saint-kitts-and-nevis', 'samoa', 'san-marino', 'sao-tome-and-prince', 'sardinia', 'saudi-arabia', 'scotland', 'senegal', 'serbia', 'seychelles', 'sierra-leone', 'singapore', 'sint-eustatius', 'sint-maarten', 'slovakia', 'slovenia', 'solomon-islands', 'somalia', 'somaliland', 'south-africa', 'south-korea', 'south-sudan', 'spain', 'sri-lanka', 'st-barts', 'st-lucia', 'st-vincent-and-the-grenadines', 'sudan', 'suriname', 'swaziland', 'sweden', 'switzerland', 'syria', 'taiwan', 'tajikistan', 'tanzania', 'thailand', 'tibet', 'togo', 'tokelau', 'tonga', 'transnistria', 'trinidad-and-tobago', 'tunisia', 'turkey', 'turkmenistan', 'turks-and-caicos', 'tuvalu', 'uganda', 'ukraine', 'united-arab-emirates', 'united-kingdom', 'united-nations', 'united-states', 'uruguay', 'uzbekistán', 'vanuatu', 'vatican-city', 'venezuela', 'vietnam', 'virgin-islands', 'wales', 'yemen', 'zambia', 'zimbabwe'

   ];

   flagIcons.forEach(icon => {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'icon-wrapper';

      const img = document.createElement('img');
      img.src = `assets/icons/flags/${icon}.png`;
      img.alt = icon;
      img.className = 'flag-icon';

      const label = document.createElement('span');
      label.className = 'icon-label';
      label.textContent = icon.replace(/-/g, ' ');

      // Add click event to copy label text
      iconWrapper.onclick = () => {
         copyToClipboard(icon);
         showToast(`${icon} copied to clipboard!`);
      };

      iconWrapper.appendChild(img);
      iconWrapper.appendChild(label);
      gridContainer.appendChild(iconWrapper);
   });

   iconContainer.appendChild(gridContainer);
}
function loadIntegrationIcons() {
   const iconContainer = document.getElementById('other-icons');

   // Add section title
   const sectionTitle = document.createElement('h2');
   sectionTitle.className = 'section-title';
   sectionTitle.id = 'integration-icons';
   sectionTitle.innerHTML = '❖ Integrations:';
   iconContainer.appendChild(sectionTitle);

   const gridContainer = document.createElement('div');
   gridContainer.className = 'integration-icons-grid';

   const integrationIcons = [
      'activecampaign', 'airtable', 'akash', 'anthropic', 'aws', 'bookingcom',
      'canva', 'channable', 'civitai', 'clickup', 'cohere', 'colossyan',
      'constantcontact', 'deepl', 'discord', 'dropbox', 'elevenlabs', 'facebook',
      'fashioncloud', 'ftp', 'google', 'google_cloud', 'google_drive', 'heygen',
      'hubspot', 'huggingface', 'hyperstack', 'instagram', 'kolsquare', 'lambdalabs',
      'linkedin', 'mailchimp', 'mailerlite', 'microsoft', 'microsoft_azure',
      'microsoft_onedrive', 'microsoft_sharepoint', 'microsoft_teams', 'midjourney',
      'monday', 'nextcloud', 'onesignal', 'openai', 'perplexity', 'perspective',
      'pinterest', 'reddit', 'replicate', 'rundiffusion', 'runway', 'salesforce',
      'sap', 'sembly', 'semrush', 'shopify', 'shopware', 'sistrix', 'slack',
      'snapchat', 'stabilityai', 'telegram', 'threads', 'tiktok', 'twilio',
      'twitch', 'twitter', 'weclapp', 'whatsapp', 'woocommerce', 'wordpress',
      'xai', 'xing', 'youtube'
   ];

   integrationIcons.forEach(icon => {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'icon-wrapper';

      const img = document.createElement('img');
      img.src = `assets/icons/integrations/${icon}.webp`;
      img.alt = icon;
      img.className = 'integration-icon';

      const label = document.createElement('span');
      label.className = 'icon-label';
      label.textContent = icon.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Add click event to copy label text
      iconWrapper.onclick = () => {
         copyToClipboard(icon);
         showToast(`${icon} copied to clipboard!`);
      };

      iconWrapper.appendChild(img);
      iconWrapper.appendChild(label);
      gridContainer.appendChild(iconWrapper);
   });

   iconContainer.appendChild(gridContainer);
}

function createIconJumplist() {
   const jumplist = document.createElement('div');
   jumplist.className = 'icon-jumplist';
   const SCROLL_OFFSET = 100; // Adjust this value to change the offset

   const sections = [
      { id: 'social-icons', title: '❖\u00A0\u00A0\u00A0\u00A0\Social Icons' },
      { id: 'payment-icons', title: '❖\u00A0\u00A0\u00A0\u00A0\Payments' },
      { id: 'app-icons', title: '❖\u00A0\u00A0\u00A0\u00A0\App Icons' },
      { id: 'integration-icons', title: '❖\u00A0\u00A0\u00A0\u00A0\Integrations' },
      { id: 'emoji-icons', title: '❖\u00A0\u00A0\u00A0\u00A0\Emoji Icons' },
      { id: 'flag-icons', title: '❖\u00A0\u00A0\u00A0\u00A0\Flag Icons' }
   ];

   sections.forEach(section => {
      const link = document.createElement('a');
      link.href = `#${section.id}`;
      link.textContent = section.title;
      link.className = 'jumplist-item';

      link.addEventListener('click', (e) => {
         e.preventDefault();
         const element = document.getElementById(section.id);
         const elementPosition = element.getBoundingClientRect().top;
         const offsetPosition = elementPosition + window.pageYOffset - SCROLL_OFFSET;

         window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
         });
      });

      jumplist.appendChild(link);
   });

   document.getElementById('other-icons').appendChild(jumplist);

   /*/ Add IDs to section titles
   document.querySelectorAll('.section-title').forEach((title, index) => {
      if (sections[index]) {
         title.id = sections[index].id;
      }
   });*/
}
class Playground {
   constructor(container) {
      this.container = container;
      this.tabs = container.querySelectorAll('.playground__tab');
      this.contents = container.querySelectorAll('.playground__content');
      this.init();
   }

   init() {
      // Initialize tabs
      this.tabs.forEach(tab => {
         tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            this.switchTab(tabName);
         });
      });

      // Set first tab as active by default
      if (this.tabs.length > 0) {
         const firstTabName = this.tabs[0].getAttribute('data-tab');
         this.switchTab(firstTabName);
      }
   }

   switchTab(tabName) {
      // Update tab states
      this.tabs.forEach(tab => {
         tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
      });

      // Update content visibility
      this.contents.forEach(content => {
         content.style.display = content.getAttribute('data-content') === tabName ? 'block' : 'none';
      });
   }
}
function initPlaygrounds() {
   const playgroundContainers = document.querySelectorAll('.playground__container');

   if (playgroundContainers.length > 0) {
      playgroundContainers.forEach(container => {
         new Playground(container);
      });
      console.log(`Initialized ${playgroundContainers.length} playground(s)`);
   }
}

function simulateScroll(scrollAmount = 500, delay = 100) {
   // Scroll down smoothly
   window.scrollBy({ top: scrollAmount, left: 0, behavior: "smooth" });

   // Wait before scrolling back up
   setTimeout(() => {
      window.scrollBy({ top: -scrollAmount, left: 0, behavior: "smooth" });
   }, delay);
}

function navigateMenuItem(direction) {
   const activeItem = document.querySelector('.category-item.active');
   if (!activeItem) return;

   // Get all menu items
   const allItems = Array.from(document.querySelectorAll('.category-item'));
   const currentIndex = allItems.indexOf(activeItem);

   // Check if we're on the "other-icons" page
   const isOtherIconsPage = activeItem.getAttribute('data-page') === 'other-icons';

   if (isOtherIconsPage) {
      // Get all icon section headers
      const sections = [
         'social-icons',
         'payment-icons',
         'app-icons',
         'integration-icons',
         'emoji-icons',
         'flag-icons'
      ];

      // Find current section based on scroll position
      const currentPosition = window.pageYOffset + 100; // Adding offset for better detection
      let currentSectionIndex = -1;

      for (let i = 0; i < sections.length; i++) {
         const section = document.getElementById(sections[i]);
         if (section && section.getBoundingClientRect().top + window.pageYOffset <= currentPosition) {
            currentSectionIndex = i;
         }
      }

      if (direction === 'up') {
         if (currentSectionIndex > 0) {
            // Navigate to previous section
            const prevSection = document.getElementById(sections[currentSectionIndex - 1]);
            if (prevSection) {
               prevSection.scrollIntoView({ behavior: 'smooth' });
               updateNavigationTooltips(); // Update tooltips immediately
               return;
            }
         } else {
            // If at first section, go to previous menu item
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
               allItems[prevIndex].click();
               updateNavigationTooltips(); // Update tooltips immediately
            }
         }
      } else { // direction === 'down'
         if (currentSectionIndex < sections.length - 1) {
            // Navigate to next section
            const nextSection = document.getElementById(sections[currentSectionIndex + 1]);
            if (nextSection) {
               nextSection.scrollIntoView({ behavior: 'smooth' });
               updateNavigationTooltips(); // Update tooltips immediately
               return;
            }
         } else {
            // If at last section, go to next menu item
            const nextIndex = currentIndex + 1;
            if (nextIndex < allItems.length) {
               allItems[nextIndex].click();
               updateNavigationTooltips(); // Update tooltips immediately
            }
         }
      }
   } else {
      // Regular menu navigation
      let nextIndex;
      if (direction === 'up') {
         nextIndex = currentIndex - 1;
         if (nextIndex < 0) nextIndex = allItems.length - 1;
      } else {
         nextIndex = currentIndex + 1;
         if (nextIndex >= allItems.length) nextIndex = 0;
      }

      const nextItem = allItems[nextIndex];
      if (nextItem) {
         nextItem.click();
         nextItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
         updateNavigationTooltips(); // Update tooltips immediately
      }
   }
}

// Add event listeners for scroll and load
document.addEventListener('DOMContentLoaded', function () {
   updateNavigationTooltips();

   // Initialize navigation when landing on other-icons page
   const activeItem = document.querySelector('.category-item.active');
   if (activeItem && activeItem.getAttribute('data-page') === 'other-icons') {
      setTimeout(updateNavigationTooltips, 100);
   }
   // Update tooltips on scroll with debounce
   let scrollTimeout;
   window.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateNavigationTooltips, 100);
   });
});
// Update the tooltip update function to handle both cases
function updateNavigationTooltips() {
   const activeItem = document.querySelector('.category-item.active');
   if (!activeItem) return;

   const isOtherIconsPage = activeItem.getAttribute('data-page') === 'other-icons';

   if (isOtherIconsPage) {
      const sections = [
         { id: 'social-icons', title: 'Social Icons' },
         { id: 'payment-icons', title: 'Payments' },
         { id: 'app-icons', title: 'App Icons' },
         { id: 'integration-icons', title: 'Integrations' },
         { id: 'emoji-icons', title: 'Emoji Icons' },
         { id: 'flag-icons', title: 'Flag Icons' }
      ];

      const currentPosition = window.pageYOffset;
      let currentSectionIndex = -1;

      for (let i = 0; i < sections.length; i++) {
         const section = document.getElementById(sections[i].id);
         if (section && section.getBoundingClientRect().top + window.pageYOffset <= currentPosition) {
            currentSectionIndex = i;
         }
      }

      if (currentSectionIndex !== -1) {
         document.getElementById('prevPageName').textContent =
            currentSectionIndex > 0 ? sections[currentSectionIndex - 1].title : 'Previous Page';
         document.getElementById('nextPageName').textContent =
            currentSectionIndex < sections.length - 1 ? sections[currentSectionIndex + 1].title : 'Next Page';
      }
   } else {
      const allItems = Array.from(document.querySelectorAll('.category-item'));
      const currentIndex = allItems.indexOf(activeItem);

      const prevIndex = currentIndex - 1 < 0 ? allItems.length - 1 : currentIndex - 1;
      const nextIndex = currentIndex + 1 >= allItems.length ? 0 : currentIndex + 1;

      document.getElementById('prevPageName').textContent = allItems[prevIndex].textContent.trim();
      document.getElementById('nextPageName').textContent = allItems[nextIndex].textContent.trim();
   }
}