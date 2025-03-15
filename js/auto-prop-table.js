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
                
                debugLog('Parsing component:', componentName);
                
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
                
                debugLog('Component', componentName, 'has', Object.keys(properties).length, 'properties');
                result[componentName] = properties;
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
        
        // Convert page name to possible component names
        const possibleNames = getPossibleComponentNames(pageName);
        debugLog('Possible component names:', possibleNames);
        
        // Check each possible name against the props data
        for (const name of possibleNames) {
            if (propsData[name]) {
                debugLog('Match found:', name);
                return {
                    name: name,
                    properties: propsData[name]
                };
            }
        }
        
        debugLog('No match found for any possible name');
        return null;
    }

    /**
     * Generate possible component names from page name
     * @param {string} pageName - The page name
     * @returns {Array<string>} Possible component names
     */
    function getPossibleComponentNames(pageName) {
        const names = [];
        
        // Handle test pages by removing the -test suffix
        if (pageName.endsWith('-test')) {
            const baseName = pageName.replace('-test', '');
            debugLog('Test page detected, using base name:', baseName);
            
            // Add the base name with first letter capitalized
            names.push(baseName.charAt(0).toUpperCase() + baseName.slice(1));
            
            // Also add the original possible names for the base name
            const baseNames = getPossibleComponentNames(baseName);
            names.push(...baseNames);
            
            return names;
        }
        
        // Convert kebab-case to different formats
        const parts = pageName.split('-');
        
        // Original format with spaces (e.g., "Button Close")
        const spacedName = parts.map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' ');
        names.push(spacedName);
        
        // Reversed format with spaces (e.g., "Close Button")
        const reversedName = [...parts].reverse().map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' ');
        names.push(reversedName);
        
        // Handle special cases
        if (pageName === 'button') {
            names.push('Button');
        } else if (pageName === 'button-with-icon-only') {
            names.push('Button with Icon Only');
        } else if (pageName === 'drop-down-menu') {
            names.push('Dropdown Menu');
        } else if (pageName === 'drop-down-box') {
            names.push('Dropdown Box');
        } else if (pageName === 'toggle-switch') {
            names.push('Toggle Switch');
        } else if (pageName === 'toggle-label') {
            names.push('Toggle Label');
        } else if (pageName === 'horizontal-tabs') {
            names.push('Horizontal Tabs');
        } else if (pageName === 'vertical-tabs') {
            names.push('Vertical Tabs');
        } else if (pageName === 'tab-button') {
            names.push('Tab Button');
        } else if (pageName === 'store-badges') {
            names.push('Store Badges');
        } else if (pageName === 'button-close') {
            names.push('Button Close');
        } else if (pageName === 'social-button') {
            names.push('Social Button');
        } else if (pageName === 'checkbox-label') {
            names.push('Checkbox Label');
        } else if (pageName === 'radio-button') {
            names.push('Radio Button');
        } else if (pageName === 'radio-button-group') {
            names.push('Radio Button Group');
        }
        
        return names;
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
        
        // Add a title
        const title = `${componentData.name} ${CONFIG.tableTitle}`;
        
        // Generate the table using the PropTableGenerator
        if (typeof createPropTable === 'function') {
            debugLog('Creating property table with title:', title);
            createPropTable(componentData.properties, title, container);
        } else {
            debugLog('PropTableGenerator not loaded');
            console.error('PropTableGenerator not loaded. Make sure to include prop-table-generator.js before this script.');
            return;
        }
        
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
        
        debugLog('Property table injected successfully');
        
        // Add some spacing
        const spacer = document.createElement('div');
        spacer.style.height = '40px';
        container.after(spacer);
        debugLog('Added spacing after table');
    }
})(); 