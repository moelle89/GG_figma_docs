/**
 * Auto Property Table Generator
 *
 * This script automatically detects the current page and injects
 * a property table from props.json if a matching component is found.
 */

(function() {
    // Enable debug mode
    const DEBUG = true;

    // Debug log function
    function debugLog(...args) {
        if (DEBUG) {
            console.log('[AutoPropTable]', ...args);
        }
    }

    debugLog('Auto Property Table Generator initialized');

    // Configuration
    const CONFIG = {
        propsJsonPath: 'assets/_ts_props/props.json',
        injectAfterSelector: '.content-header',
        tableContainerId: 'auto-generated-prop-table',
        tableTitle: 'Component Properties'
    };

    /**
     * Initialize the auto property table generator
     */
    window.initializeAutoPropTables = function() {
        debugLog('Starting property table generation');

        // Get the current page name
        const pageName = getCurrentPageName();
        if (!pageName) {
            debugLog('No valid page name found, aborting');
            return;
        }

        debugLog('Page name detected:', pageName);

        // Load the props.json file
        loadPropsJson()
            .then(propsData => {
                debugLog('Props data loaded successfully, found', Object.keys(propsData).length, 'components');

                // Find matching component data
                const componentData = findComponentData(propsData, pageName);
                if (componentData) {
                    debugLog('Matching component found:', componentData.name);
                    // Generate and inject the property table
                    injectPropertyTable(componentData);
                } else {
                    debugLog('No matching component data found for:', pageName);
                    console.log(`No matching component data found for: ${pageName}`);
                }
            })
            .catch(error => {
                debugLog('Error loading props.json:', error);
                console.error('Error loading props.json:', error);
            });
    }

    /**
     * Get the current page name from the URL or active sidebar item
     * @returns {string|null} The page name without extension
     */
    function getCurrentPageName() {
        // First try to get the name from the active sidebar item
        const activeItem = document.querySelector('.category-item.active');
        if (activeItem) {
            const pageName = activeItem.getAttribute('data-page');
            debugLog('Page name from active sidebar item:', pageName);
            return pageName;
        }

        // Fallback to URL for direct page loads
        const path = window.location.pathname;
        const pageName = path.split('/').pop();

        debugLog('Raw page name from URL:', pageName);

        // Return null if we're on the index page
        if (!pageName || pageName === '' || pageName === 'index.html') {
            debugLog('Index page detected, returning null');
            return null;
        }

        // Remove .html extension
        const cleanPageName = pageName.replace('.html', '');
        debugLog('Clean page name:', cleanPageName);
        return cleanPageName;
    }

    /**
     * Load and parse the props.json file
     * @returns {Promise<Object>} The parsed props data
     */
    function loadPropsJson() {
        debugLog('Loading props.json from:', CONFIG.propsJsonPath);

        return new Promise((resolve, reject) => {
            fetch(CONFIG.propsJsonPath)
                .then(response => {
                    if (!response.ok) {
                        debugLog('Failed to load props.json:', response.status);
                        throw new Error(`Failed to load props.json: ${response.status}`);
                    }
                    debugLog('Props.json fetched successfully');
                    return response.text();
                })
                .then(text => {
                    debugLog('Parsing props.json');
                    // The props.json file has a non-standard format, so we need to parse it manually
                    const parsedData = parsePropsJson(text);
                    debugLog('Props.json parsed successfully');
                    resolve(parsedData);
                })
                .catch(error => {
                    debugLog('Error in loadPropsJson:', error);
                    reject(error);
                });
        });
    }

    /**
     * Parse the non-standard props.json format
     * @param {string} jsonText - The raw text from props.json
     * @returns {Object} Parsed component data
     */
    function parsePropsJson(jsonText) {
        debugLog('Starting to parse props.json text');
        const result = {};

        // Remove the outer braces and split by component
        const componentsText = jsonText.trim().slice(1, -1).trim();

        // Split the text by component definitions (looking for "}, " pattern)
        const componentBlocks = componentsText.split(/},\s*(?=[A-Za-z])/);
        debugLog('Found', componentBlocks.length, 'component blocks');

        componentBlocks.forEach((block, index) => {
            // Extract component name and properties
            const match = block.match(/([^{]+){\s*([\s\S]+)/);
            if (match) {
                const componentName = match[1].trim();
                const propertiesText = match[2].trim();

                // Trim "❖ " from the component name if it exists
                const cleanedComponentName = componentName.startsWith('❖ ') ? componentName.slice(3) : componentName;

                debugLog('Parsing component:', cleanedComponentName);

                // Parse properties
                const properties = {};
                const propertyLines = propertiesText.split(/;\s*(?=\w)/);

                propertyLines.forEach(line => {
                    if (!line.trim()) return;

                    // Split by first colon to get property name and type
                    const colonIndex = line.indexOf(':');
                    if (colonIndex > 0) {
                        const propName = line.substring(0, colonIndex).trim();
                        const propType = line.substring(colonIndex + 1).trim();
                        properties[propName] = propType;
                    }
                });

                debugLog('Component', cleanedComponentName, 'has', Object.keys(properties).length, 'properties');
                result[cleanedComponentName] = properties; // Use cleanedComponentName here
            } else {
                debugLog('Failed to parse component block', index);
            }
        });

        debugLog('Finished parsing props.json, found', Object.keys(result).length, 'components');
        return result;
    }

    /**
     * Find component data that matches the current page
     * @param {Object} propsData - The parsed props data
     * @param {string} pageName - The current page name
     * @returns {Object|null} The matching component data or null
     */
    function findComponentData(propsData, pageName) {
        debugLog('Finding component data for page:', pageName);

        // Get possible component names
        const possibleNames = getPossibleComponentNames(pageName);
        debugLog('Possible component names:', possibleNames);

        // Find matching component
        const componentData = findMatchingComponent(propsData, possibleNames);
        if (componentData) {
            debugLog('Match found:', componentData.name);
            return {
                name: componentData.name,
                properties: componentData
            };
        } else {
            debugLog('No match found for any possible name');
            return null;
        }
    }

    /**
     * Generate possible component names from page name
     * @param {string} pageName - The page name
     * @returns {Array<string>} Possible component names
     */
    function getPossibleComponentNames(pageName) {
        debugLog(`Getting possible component names for page: ${pageName}`);
        const names = [];

        // Remove -test suffix if present
        if (pageName.endsWith('-test')) {
            pageName = pageName.slice(0, -5);
            debugLog(`Removed -test suffix, base name is: ${pageName}`);
        }

        // Normalize the page name by removing special characters and converting to lowercase
        const normalizedName = pageName.toLowerCase().replace(/[^a-z0-9]/g, '');
        debugLog(`Normalized name: ${normalizedName}`);

        // Generate variations of the name
        const words = pageName.split(/[-\s]/);
        debugLog(`Split words: ${words}`);

        // Original kebab case name
        names.push(pageName);

        // Pascal case (e.g., "AvatarLabeled")
        const pascalCase = words.map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('');
        names.push(pascalCase);

        // Space separated (e.g., "Avatar Labeled")
        const spaceCase = words.map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        names.push(spaceCase);

        // No spaces pascal case (e.g., "AvatarStack")
        const noSpacesPascalCase = words.map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('');
        names.push(noSpacesPascalCase);

        // Add special cases for specific components
        if (pageName === 'button') {
            names.push('Button');
            names.push('ButtonComponent');
        }

        debugLog(`Generated component name variations: ${names.join(', ')}`);
        return names;
    }

    /**
     * Find matching component in props data
     * @param {Object} propsData - The parsed props data
     * @param {Array<string>} componentNames - Possible component names
     * @returns {Object|null} The matching component data or null
     */
    function findMatchingComponent(propsData, componentNames) {
        debugLog(`Looking for matching component in props data...`);

        // Normalize all component names in props data
        const normalizedPropsData = {};
        Object.keys(propsData).forEach(key => {
            const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            normalizedPropsData[normalizedKey] = propsData[key];
        });

        for (const name of componentNames) {
            // Check exact match first
            if (propsData[name]) {
                debugLog(`Found exact match for component: ${name}`);
                return propsData[name];
            }

            // Check normalized match
            const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const matchingKey = Object.keys(propsData).find(key =>
                key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedName
            );

            if (matchingKey) {
                debugLog(`Found normalized match: ${matchingKey} for ${name}`);
                return propsData[matchingKey];
            }
        }

        debugLog(`No matching component found for variations: ${componentNames.join(', ')}`);
        return null;
    }

    /**
     * Inject the property table into the page
     * @param {Object} componentData - The component data
     */
    function injectPropertyTable(componentData) {
        debugLog('Injecting property table for:', componentData.name);

        // Create container for the property table
        const container = document.createElement('div');
        container.id = CONFIG.tableContainerId;
        container.className = 'auto-prop-table-container';

        // Generate the table using the PropTableGenerator
        if (typeof createPropTable === 'function') {
            debugLog('Creating property table');
            createPropTable(componentData.properties, `${CONFIG.tableTitle}`, container);
        } else {
            debugLog('PropTableGenerator not loaded');
            console.error('PropTableGenerator not loaded. Make sure to include prop-table-generator.js before this script.');
            return;
        }

        // Check for playground__container
        const playgroundContainer = document.querySelector('.playground__container');
        if (playgroundContainer) {
            debugLog('playground__container found, inserting table under it');
            playgroundContainer.after(container); // Change made here to append after
        } else {
            // Find the grid-2-col section that contains the section title
            const gridSection = Array.from(document.querySelectorAll('.grid-2-col')).find(grid => {
                return grid.querySelector('.section-title') && grid.querySelector('.two-tone-button');
            });

            if (!gridSection) {
                debugLog('Grid section not found, falling back to content container');
                // Fallback to content container if grid section not found
                const contentContainer = document.querySelector('.content');
                if (!contentContainer) {
                    debugLog('Content container not found');
                    console.error('Content container not found');
                    return;
                }
                contentContainer.appendChild(container);
            } else {
                debugLog('Grid section found, inserting table after it');
                gridSection.after(container);
            }
        }

        debugLog('Property table injected successfully');

        // Add some spacing
        const spacer = document.createElement('div');
        spacer.style.height = '40px';
        container.after(spacer);
        debugLog('Added spacing after table');
    }
})();