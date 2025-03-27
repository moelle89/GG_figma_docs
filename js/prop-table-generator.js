/**
 * Property Table Generator
 *
 * This script generates an HTML table from a JSON dataset, displaying properties and their values.
 * It can handle any JSON object structure and automatically creates a visually appealing table.
 */

class PropTableGenerator {
    constructor(options = {}) {
        this.options = {
            tableClass: 'prop-table',
            headerClass: 'prop-table-header',
            rowClass: 'prop-table-row',
            cellClass: 'prop-table-cell',
            propertyClass: 'prop-property',
            valueClass: 'prop-value',
            containerClass: 'prop-table-container',
            titleClass: 'prop-table-title',
            ...options
        };
    }

    /**
     * Generate a property table from a JSON dataset
     * @param {Object} data - The JSON data to display
     * @param {String} title - Optional title for the table
     * @param {HTMLElement} container - Container element to append the table to
     * @returns {HTMLElement} - The generated table element
     */
    generateTable(data, title = null, container = null) {
        // Create container
        const tableContainer = document.createElement('div');
        tableContainer.className = this.options.containerClass;

        // Add title if provided
        if (title) {
            const titleElement = document.createElement('h3');
            titleElement.className = this.options.titleClass;
            titleElement.textContent = title;
            tableContainer.appendChild(titleElement);
        }

        // Create table
        const table = document.createElement('table');
        table.className = this.options.tableClass;

        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.className = this.options.headerClass;

        const propertyHeader = document.createElement('th');
        propertyHeader.textContent = 'Property';
        propertyHeader.className = this.options.propertyClass;

        const valueHeader = document.createElement('th');
        valueHeader.textContent = 'Value';
        valueHeader.className = this.options.valueClass;

        headerRow.appendChild(propertyHeader);
        headerRow.appendChild(valueHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');

        // Add rows for each property
        for (const [key, value] of Object.entries(data)) {
            const row = document.createElement('tr');
            row.className = this.options.rowClass;

            const propertyCell = document.createElement('td');
            propertyCell.className = `${this.options.cellClass} ${this.options.propertyClass}`;
            propertyCell.textContent = this.formatPropertyName(key);

            const valueCell = document.createElement('td');
            valueCell.className = `${this.options.cellClass} ${this.options.valueClass}`;

            // Format the value based on its type
            if (Array.isArray(value)) {
                valueCell.innerHTML = this.formatArrayValue(value);
            } else if (typeof value === 'object' && value !== null) {
                valueCell.innerHTML = this.formatObjectValue(value);
            } else if (typeof value === 'boolean') {
                valueCell.innerHTML = value ? '<span class="boolean-true">True</span>' : '<span class="boolean-false">False</span>';
            } else {
                valueCell.textContent = value !== null && value !== undefined ? value.toString() : '-';
            }

            row.appendChild(propertyCell);
            row.appendChild(valueCell);
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        tableContainer.appendChild(table);

        // Append to container if provided
        if (container) {
            container.appendChild(tableContainer);
        }

        return tableContainer;
    }

    /**
     * Format a property name for display
     * @param {String} name - The property name
     * @returns {String} - Formatted property name
     */
    formatPropertyName(name) {
        // Convert camelCase or snake_case to Title Case with spaces
        return name
            .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
            .trim();
    }

    /**
     * Format an array value for display
     * @param {Array} array - The array to format
     * @returns {String} - HTML string representing the array
     */
    formatArrayValue(array) {
        if (array.length === 0) return '-';

        return array
            .map(item => {
                if (typeof item === 'object' && item !== null) {
                    return `<div class="array-item-object">${this.formatObjectValue(item)}</div>`;
                } else {
                    return `<div class="array-item">${item}</div>`;
                }
            })
            .join('');
    }

    /**
     * Format an object value for display
     * @param {Object} obj - The object to format
     * @returns {String} - HTML string representing the object
     */
    formatObjectValue(obj) {
        if (!obj || Object.keys(obj).length === 0) return '-';

        return Object.entries(obj)
            .map(([key, value]) => {
                const formattedKey = this.formatPropertyName(key);
                let formattedValue;

                if (Array.isArray(value)) {
                    formattedValue = this.formatArrayValue(value);
                } else if (typeof value === 'object' && value !== null) {
                    formattedValue = this.formatObjectValue(value);
                } else if (typeof value === 'boolean') {
                    formattedValue = value ? '<span class="boolean-true">True</span>' : '<span class="boolean-false">False</span>';
                } else {
                    formattedValue = value !== null && value !== undefined ? value.toString() : '-';
                }

                return `<div class="object-property"><span class="object-key">${formattedKey}:</span> <span class="object-value">${formattedValue}</span></div>`;
            })
            .join('');
    }

    /**
     * Create a table from a TypeScript interface definition
     * @param {String} interfaceString - TypeScript interface definition
     * @param {String} title - Optional title for the table
     * @param {HTMLElement} container - Container element to append the table to
     * @returns {HTMLElement} - The generated table element
     */
    generateTableFromInterface(interfaceString, title = null, container = null) {
        // Parse the interface string to extract properties and types
        const data = this.parseInterfaceString(interfaceString);
        return this.generateTable(data, title, container);
    }

    /**
     * Parse a TypeScript interface string into a JavaScript object
     * @param {String} interfaceString - TypeScript interface definition
     * @returns {Object} - JavaScript object representing the interface
     */
    parseInterfaceString(interfaceString) {
        const result = {};

        // Extract the content between curly braces
        const match = interfaceString.match(/\{([^}]+)\}/);
        if (!match) return result;

        const content = match[1];

        // Split by semicolons and process each line
        const lines = content.split(';').map(line => line.trim()).filter(line => line);

        lines.forEach(line => {
            // Split the line into property name and type
            const parts = line.split(':').map(part => part.trim());
            if (parts.length < 2) return;

            const propertyName = parts[0];
            const propertyType = parts.slice(1).join(':').trim();

            result[propertyName] = propertyType;
        });

        return result;
    }
}

// Example usage:
// const tableGenerator = new PropTableGenerator();
// const data = {
//     'button label': 'Click me',
//     'icon after': true,
//     'icon before': false,
//     'size': 'md',
//     'type': 'Primary',
//     'state': 'Default',
//     'corner radius': 'Default'
// };
// tableGenerator.generateTable(data, 'Button Properties', document.getElementById('table-container'));

// Create a global instance for easy access
window.propTableGenerator = new PropTableGenerator();

/**
 * Create a property table from a JSON object
 * @param {Object} data - The JSON data to display
 * @param {String} title - Optional title for the table
 * @param {String|HTMLElement} container - Container element ID or element to append the table to
 */
function createPropTable(data, title = null, container = null) {
    const tableGenerator = window.propTableGenerator;

    let containerElement = container;
    if (typeof container === 'string') {
        containerElement = document.getElementById(container);
    }

    return tableGenerator.generateTable(data, title, containerElement);
}

/**
 * Create a property table from a TypeScript interface string
 * @param {String} interfaceString - TypeScript interface definition
 * @param {String} title - Optional title for the table
 * @param {String|HTMLElement} container - Container element ID or element to append the table to
 */
function createPropTableFromInterface(interfaceString, title = null, container = null) {
    const tableGenerator = window.propTableGenerator;

    let containerElement = container;
    if (typeof container === 'string') {
        containerElement = document.getElementById(container);
    }

    return tableGenerator.generateTableFromInterface(interfaceString, title, containerElement);
}

/**
 * Creates a property table from the given properties
 * @param {Object} properties - The properties to display
 * @param {string} title - The title for the table
 * @param {HTMLElement} container - The container to append the table to
 */
function createPropTable(properties, title, container) {
    // Create title
    const titleElement = document.createElement('h3');
    titleElement.className = 'auto-prop-table-title';
    titleElement.textContent = title;
    container.appendChild(titleElement);

    // Create legend
    const legendContainer = document.createElement('div');
    legendContainer.className = 'prop-table-legend';
    legendContainer.innerHTML = `
        <div class="legend-title">Legend:</div>
        <div class="legend-items">
            <div class="legend-item">
                <span class="bool-true">True</span>
                <span class="legend-text">Boolean switches that either enable the named content directly or activate additional related properties when enabled. Related properties usually include the switch name.</span>
            </div>
            <div class="legend-item">
                <span class="variant-option">string</span>
                <span class="legend-text">Text values that can be freely defined by the user.</span>
            </div>
            <div class="legend-item">
                <span class="variant-option">Pill</span>
                <span class="legend-text">When used with corner-radius, creates completely rounded sides.</span>
            </div>
        </div>
    `;
    container.appendChild(legendContainer);

    // Create table
    const table = document.createElement('table');
    table.className = 'auto-prop-table';

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Property Name', 'Type', 'Variant Options'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');
    Object.entries(properties).forEach(([propName, propType]) => {
        const row = document.createElement('tr');

        // Property name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = propName;
        row.appendChild(nameCell);

        // Type cell
        const typeCell = document.createElement('td');
        const baseType = getBaseType(propType);
        typeCell.textContent = baseType;
        row.appendChild(typeCell);

        // Variants cell
        const variantsCell = document.createElement('td');
        const variants = getVariants(propType);
        if (variants.length > 0) {
            variants.forEach(variant => {
                const variantSpan = document.createElement('span');
                variantSpan.className = 'variant-option';

                // Check if this is a default value
                if (variant.startsWith('default=')) {
                    variantSpan.setAttribute('data-default', 'true');
                    variantSpan.textContent = variant;
                } else {
                    variantSpan.textContent = variant;
                }

                variantsCell.appendChild(variantSpan);
                // Add a space between variants
                variantsCell.appendChild(document.createTextNode(' '));
            });
        } else if (baseType === 'boolean') {
            // Special handling for boolean types
            const trueSpan = document.createElement('span');
            trueSpan.className = 'bool-true';
            trueSpan.textContent = 'True';

            const falseSpan = document.createElement('span');
            falseSpan.className = 'bool-false';
            falseSpan.textContent = 'False';

            variantsCell.appendChild(trueSpan);
            variantsCell.appendChild(document.createTextNode(' '));
            variantsCell.appendChild(falseSpan);
        } else if (baseType === 'ReactNode') {
            // Special handling for ReactNode type
            const swapSpan = document.createElement('span');
            swapSpan.className = 'variant-option';
            swapSpan.textContent = 'swapInstance';
            variantsCell.appendChild(swapSpan);
        } else {
            variantsCell.textContent = '-';
        }
        row.appendChild(variantsCell);

        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
}

/**
 * Gets the base type from a property type string
 * @param {string} type - The property type
 * @returns {string} The base type
 */
function getBaseType(type) {
    if (type.includes('|')) {
        return 'Variant';
    }
    return type.split(';')[0].trim();
}

/**
 * Gets the variants from a property type string
 * @param {string} type - The property type
 * @returns {Array<string>} The variants
 */
function getVariants(type) {
    if (!type.includes('|')) {
        return [];
    }

    return type
        .split('|')
        .map(v => v.trim().replace(/['"]/g, '').replace(/;$/, '')) // Remove semicolon at the end
        .filter(v => v !== '');
}

// Make the function available globally
window.createPropTable = createPropTable;