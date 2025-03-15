/**
 * Property Table Includer
 * 
 * This script dynamically includes the necessary files for property tables
 * on component pages. It should be included in the main template or layout file.
 */

// Enable debug mode
const DEBUG = true;

// Debug log function
function debugLog(...args) {
    if (DEBUG) {
        console.log('[PropTables]', ...args);
    }
}

debugLog('Property Table Includer initialized');

/**
 * Initialize property tables for the current page
 */
window.initializePropTables = function() {
    debugLog('Initializing property tables');
    
    // Only run on component pages (not on index or other special pages)
    if (isComponentPage()) {
        debugLog('Component page detected:', window.location.pathname);
        
        // Include the necessary CSS files
        includeCss('css/prop-table.css');
        includeCss('css/auto-prop-table.css');
        
        // Include the necessary JS files
        includeJs('js/prop-table-generator.js', function() {
            debugLog('prop-table-generator.js loaded');
            // After the generator is loaded, include the auto-prop-table script
            includeJs('js/auto-prop-table.js', function() {
                debugLog('auto-prop-table.js loaded');
                // If auto-prop-table.js defines its own init function, call it
                if (typeof initializeAutoPropTables === 'function') {
                    initializeAutoPropTables();
                }
            });
        });
    } else {
        debugLog('Not a component page, skipping property table inclusion');
    }
}

/**
 * Check if the current page is a component page
 * @returns {boolean} True if this is a component page
 */
function isComponentPage() {
    // First check if we're in a dynamically loaded component
    const activeItem = document.querySelector('.category-item.active');
    if (activeItem) {
        const componentName = activeItem.getAttribute('data-page');
        debugLog('Found active component:', componentName);
        
        // Exclude special pages
        if (componentName === 'ui-component-lib' ||
            componentName === 'how-to' ||
            componentName === 'prop-table-demo') {
            debugLog('Component is in exclusion list');
            return false;
        }
        return true;
    }
    
    // Fallback to URL check for direct page loads
    const path = window.location.pathname;
    const pageName = path.split('/').pop();
    
    debugLog('Checking if page is a component page:', pageName);
    
    // Exclude index and special pages
    if (!pageName || 
        pageName === '' || 
        pageName === 'index.html' || 
        pageName === 'ui-component-lib.html' ||
        pageName === 'how-to.html' ||
        pageName === 'prop-table-demo.html') {
        debugLog('Page is in exclusion list, not a component page');
        return false;
    }
    
    debugLog('Page is a component page');
    return true;
}

/**
 * Dynamically include a CSS file
 * @param {string} href - Path to the CSS file
 */
function includeCss(href) {
    debugLog('Including CSS:', href);
    
    // Check if the CSS is already included
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) {
        debugLog('CSS already included:', href);
        return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    debugLog('CSS included:', href);
}

/**
 * Dynamically include a JavaScript file
 * @param {string} src - Path to the JavaScript file
 * @param {Function} callback - Optional callback to run after the script loads
 */
function includeJs(src, callback) {
    debugLog('Including JS:', src);
    
    // Check if the script is already included
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
        debugLog('JS already included:', src);
        if (callback) {
            callback();
        }
        return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    
    if (callback) {
        script.onload = function() {
            debugLog('JS loaded:', src);
            callback();
        };
        
        script.onerror = function() {
            console.error('[PropTables] Error loading script:', src);
        };
    }
    
    document.body.appendChild(script);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePropTables();
}); 