// Define the UI sizes at the top of the file
const UI_SIZES = {
  compact: { width: 240, height: 574 },
  expanded: { width: 280, height: 930 } // Use a taller, fixed size for expanded mode
};

// Use the compact size as default in the showUI call
figma.showUI(__html__, {
  width: UI_SIZES.compact.width,
  height: UI_SIZES.compact.height,
  themeColors: true
});
// ===================================
let currentTab = "components-tab";

// Cache for storing loaded components and icons
const cache = {
  components: null,
  icons: null
};

// Check if the user has the Figma API available (Plugin API 37 or later)
const hasImportSupport = typeof figma.importComponentByKeyAsync === 'function';

// Add these helper functions for client storage
async function saveToClientStorage(key, data) {
  try {
    await figma.clientStorage.setAsync(key, data);
  } catch (error) {
    console.error(`Error saving to client storage: ${error}`);
  }
}

async function loadFromClientStorage(key) {
  try {
    return await figma.clientStorage.getAsync(key);
  } catch (error) {
    console.error(`Error loading from client storage: ${error}`);
    return null;
  }
}

// Function to load components from the current file
async function loadComponentsFromCurrentFile() {
  try {
    // First try to load from cache
    if (cache.components) {
      figma.ui.postMessage({
        status: `Found ${cache.components.length} components.`,
        components: cache.components
      });
      return;
    }

    // Then try to load from client storage
    const storedComponents = await loadFromClientStorage('cachedComponents');
    if (storedComponents) {
      cache.components = storedComponents;
      figma.ui.postMessage({
        status: `Found ${storedComponents.length} components.`,
        components: storedComponents
      });
      return;
    }

    figma.ui.postMessage({ status: "Loading components from current file..." });

    await figma.loadAllPagesAsync();

    // Look for a page named "COMPONENTS"
    const componentsPage = figma.root.children.find(page => page.name === "COMPONENTS");

    if (!componentsPage) {
      throw new Error("No COMPONENTS page found. Please create a page named 'COMPONENTS' to store your components.");
    }

    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    // Find components with the ❖ prefix
    const components = componentsPage.findAll(node =>
      (node.type === "COMPONENT" || node.type === "COMPONENT_SET") && node.name.startsWith("❖ ")
    );

    if (components.length === 0) {
      throw new Error("No components found with ❖ prefix. Please prefix your components with ❖ to make them discoverable.");
    }

    // Process components in smaller batches
    const BATCH_SIZE = 3;
    const formattedComponents = [];
    let failedComponents = [];

    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      try {
        // Get the default variant if it's a component set
        const targetComponent = component.type === "COMPONENT_SET"
          ? component.defaultVariant
          : component;

        // Export the component as a PNG
        const exportSettings = {
          format: "PNG",
          constraint: { type: "SCALE", value: 1.5 }
        };

        const bytes = await targetComponent.exportAsync(exportSettings);
        const base64Image = figma.base64Encode(bytes);

        formattedComponents.push({
          id: component.id,
          name: component.name.replace('❖ ', ''),
          thumbnail: base64Image
        });

        // Update progress every few components
        if (i % BATCH_SIZE === 0 || i === components.length - 1) {
          figma.ui.postMessage({
            status: `Loading components... (${i + 1}/${components.length})`
          });
        }

        // Small delay between batches to prevent memory issues
        if (i % BATCH_SIZE === BATCH_SIZE - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.warn(`Failed to export component ${component.name}:`, error);
        failedComponents.push(component.name);
        formattedComponents.push({
          id: component.id,
          name: component.name.replace('❖ ', ''),
          colorHash: stringToColor(component.name),
          firstChar: component.name.replace('❖ ', '').charAt(0).toUpperCase()
        });
      }
    }

    // Store in both cache and client storage
    cache.components = formattedComponents;
    await saveToClientStorage('cachedComponents', formattedComponents);

    // Show warning if any components failed to load
    if (failedComponents.length > 0) {
      figma.notify(`Warning: ${failedComponents.length} components failed to load thumbnails. Using fallback display.`, { timeout: 5000 });
    }

    figma.ui.postMessage({
      status: `Found ${components.length} components.`,
      components: formattedComponents
    });
  } catch (error) {
    console.error("Error loading current file components:", error);
    figma.ui.postMessage({
      error: error.message || "Error loading components. Please check the console for details.",
      components: []
    });
    figma.notify(error.message || "Error loading components", { error: true });
  }
}

// Function to load icons from the current file
async function loadIconComponentsFromCurrentFile() {
  // First try to load from cache
  if (cache.icons) {
    figma.ui.postMessage({
      iconsStatus: `Found ${cache.icons.length} icons.`,
      icons: cache.icons
    });
    return;
  }

  // Then try to load from client storage
  const storedIcons = await loadFromClientStorage('cachedIcons');
  if (storedIcons) {
    cache.icons = storedIcons;
    figma.ui.postMessage({
      iconsStatus: `Found ${storedIcons.length} icons.`,
      icons: storedIcons
    });
    return;
  }

  // If no cache at all, load everything from scratch
  console.log("Loading icons from file...");
  try {
    figma.ui.postMessage({ iconsStatus: "Loading icons from current file..." });

    await figma.loadAllPagesAsync();

    // Look for a page named "COMPONENTS"
    const componentsPage = figma.root.children.find(page => page.name === "COMPONENTS");

    if (!componentsPage) {
      figma.ui.postMessage({
        iconsError: "No COMPONENTS page found in the current file.",
        icons: []
      });
      return;
    }

    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    // Define all icon sections to look for
    const iconSections = [
      "icons",
      "Apps & Programs",
      "Integrations"
    ];

    // Find components from all icon sections
    let allIcons = [];

    // Collect icons from each section
    for (const section of iconSections) {
      const sectionIcons = componentsPage.findAll(node =>
        (node.type === "COMPONENT" || node.type === "COMPONENT_SET") &&
        node.parent && node.parent.name === section
      );
      allIcons = [...allIcons, ...sectionIcons];
    }

    if (allIcons.length === 0) {
      figma.ui.postMessage({
        iconsError: "No icon components found in any of the icon sections.",
        icons: []
      });
      return;
    }

    // Process icons in smaller batches
    const BATCH_SIZE = 3;
    const formattedComponents = [];

    for (let i = 0; i < allIcons.length; i++) {
      const component = allIcons[i];
      try {
        // Get the default variant if it's a component set
        const targetComponent = component.type === "COMPONENT_SET"
          ? component.defaultVariant
          : component;

        // Export the component as a JPG with minimal scale to reduce storage size
        const exportSettings = {
          format: "JPG",
          constraint: { type: "SCALE", value: 1 }
        };

        const bytes = await targetComponent.exportAsync(exportSettings);
        const base64Image = figma.base64Encode(bytes);

        formattedComponents.push({
          id: component.id,
          name: component.name,
          thumbnail: base64Image,
          section: component.parent.name // Add section information
        });

        // Update progress every few icons
        if (i % BATCH_SIZE === 0 || i === allIcons.length - 1) {
          figma.ui.postMessage({
            iconsStatus: `Loading icons... (${i + 1}/${allIcons.length})`
          });
        }

        // Small delay between batches to prevent memory issues
        if (i % BATCH_SIZE === BATCH_SIZE - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.warn(`Failed to export icon ${component.name}:`, error);
        formattedComponents.push({
          id: component.id,
          name: component.name,
          colorHash: stringToColor(component.name),
          firstChar: component.name.charAt(0).toUpperCase(),
          section: component.parent.name // Add section information
        });
      }
    }

    // Store in both cache and client storage
    cache.icons = formattedComponents;

    // Save to client storage - same approach as components
    try {
      await saveToClientStorage('cachedIcons', formattedComponents);
    } catch (error) {
      console.error("Error saving icons to client storage:", error);
      figma.notify("Icons were loaded but couldn't be cached (storage full)", { timeout: 2000 });
    }

    figma.ui.postMessage({
      iconsStatus: `Found ${allIcons.length} icons.`,
      icons: formattedComponents
    });
  } catch (error) {
    console.error("Error loading icon components:", error);
    figma.ui.postMessage({
      iconsError: "Error loading icons: " + error.message,
      icons: []
    });
  }
}

// Function to generate a color from a string
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}

// Function to reload and refresh the cache
async function refreshCache(type) {
  if (type === 'components') {
    cache.components = null;
    await figma.clientStorage.deleteAsync('cachedComponents');
    loadComponentsFromCurrentFile();
  } else if (type === 'icons') {
    cache.icons = null;
    // Clear both full icons and metadata cache if it exists
    await figma.clientStorage.deleteAsync('cachedIcons');
    await figma.clientStorage.deleteAsync('cachedIconsMetadata');
    figma.notify("Icons cache cleared, reloading icons...");
    loadIconComponentsFromCurrentFile();
  } else {
    // Refresh all
    cache.components = null;
    cache.icons = null;
    await figma.clientStorage.deleteAsync('cachedComponents');
    await figma.clientStorage.deleteAsync('cachedIcons');
    await figma.clientStorage.deleteAsync('cachedIconsMetadata');
    loadComponentsFromCurrentFile();
    loadIconComponentsFromCurrentFile();
  }
}

// Start by loading components from the current file
loadComponentsFromCurrentFile();

// Handle UI messages
figma.ui.onmessage = async msg => {
  if (msg.type === "close") {
    figma.closePlugin();
  }
  else if (msg.type === "tab-change") {
    currentTab = msg.tab;

    if (currentTab === "icons-tab") {
      // Only load icons if they're not already cached
      if (!cache.icons) {
        loadIconComponentsFromCurrentFile();
      } else {
        // Just re-send the cached data
        figma.ui.postMessage({
          iconsStatus: `Found ${cache.icons.length} icons.`,
          icons: cache.icons
        });
      }
    } else if (currentTab === "components-tab") {
      // Only load components if they're not already cached
      if (!cache.components) {
        loadComponentsFromCurrentFile();
      } else {
        // Just re-send the cached data
        figma.ui.postMessage({
          status: `Found ${cache.components.length} components.`,
          components: cache.components
        });
      }
    }
  }
  else if (msg.type === "refresh") {
    // Handle refresh requests
    refreshCache(msg.target);
    figma.notify("Refreshing components...");
  }
  else if (msg.type === "create-instance") {
    try {
      const node = await figma.getNodeByIdAsync(msg.id);
      let instance;

      // Create an instance with default properties
      if (node.type === "COMPONENT_SET") {
        // Just use the default variant
        const defaultVariant = node.defaultVariant;
        instance = defaultVariant.createInstance();
      } else if (node.type === "COMPONENT") {
        instance = node.createInstance();
      } else {
        throw new Error("Invalid component type: " + node.type);
      }

      // Position and select the instance
      instance.x = figma.viewport.center.x;
      instance.y = figma.viewport.center.y;
      figma.currentPage.appendChild(instance);
      figma.viewport.scrollAndZoomIntoView([instance]);
      figma.currentPage.selection = [instance];

      // Get component properties and send to UI for editing
      const componentProperties = await getComponentProperties(msg.id, instance.id);
      figma.ui.postMessage({
        type: "show-component-properties",
        properties: componentProperties,
        instanceId: instance.id
      });

    } catch (error) {
      figma.notify("Error creating component instance: " + error.message, { error: true });
    }
  }
  else if (msg.type === "update-instance-properties") {
    try {
      const instance = await figma.getNodeByIdAsync(msg.instanceId);

      if (instance && instance.type === "INSTANCE") {
        const setProps = {};

        // Set all properties based on their type
        Object.entries(msg.properties).forEach(([key, value]) => {
          if (instance.componentProperties && instance.componentProperties[key]) {
            // Add to the properties object
            setProps[key] = value;
          }
        });

        console.log("Updating instance properties:", setProps);
        if (Object.keys(setProps).length > 0) {
          instance.setProperties(setProps);
        }

        // Select the instance again to show the changes
        figma.currentPage.selection = [instance];
        figma.notify("Component properties updated successfully!");
      } else {
        throw new Error("Instance not found or invalid");
      }
    } catch (error) {
      console.error("Error details:", error);
      figma.notify("Error updating instance properties: " + error.message, { error: true });
    }
  }
  else if (msg.type === "create-instance-with-properties") {
    try {
      const node = await figma.getNodeByIdAsync(msg.componentId);
      let instance;

      // Get an instance
      if (node.type === "COMPONENT_SET") {
        // Find the variant based on variant properties
        const variantProps = {};

        // Extract only the variant properties
        Object.entries(node.componentPropertyDefinitions).forEach(([key, def]) => {
          if (def.type === 'VARIANT' && msg.properties[key]) {
            variantProps[key] = msg.properties[key];
          }
        });

        console.log("Finding variant with properties:", variantProps);

        // Find the variant that matches the selected properties
        const variant = node.children.find(child => {
          // Parse the variant name
          const variantName = child.name;
          const variantProperties = variantName.split(", ").reduce((acc, pair) => {
            const [key, value] = pair.split("=");
            acc[key] = value;
            return acc;
          }, {});

          // Check if variant matches all required properties
          return Object.entries(variantProps).every(([key, value]) =>
            variantProperties[key] === value
          );
        });

        if (!variant) {
          console.log("Available variants:", node.children.map(c => c.name));
          throw new Error("Could not find matching variant for selected properties");
        }

        instance = variant.createInstance();
      } else if (node.type === "COMPONENT") {
        instance = node.createInstance();
      } else {
        throw new Error("Invalid component type: " + node.type);
      }

      // Set all non-variant instance properties
      if (instance) {
        const setProps = {};

        // Set all properties based on their type
        Object.entries(msg.properties).forEach(([key, value]) => {
          if (instance.componentProperties && instance.componentProperties[key]) {
            // Add to the properties object
            setProps[key] = value;
          }
        });

        console.log("Setting instance properties:", setProps);
        if (Object.keys(setProps).length > 0) {
          instance.setProperties(setProps);
        }
      }

      // Position and select the instance
      instance.x = figma.viewport.center.x;
      instance.y = figma.viewport.center.y;
      figma.currentPage.appendChild(instance);
      figma.viewport.scrollAndZoomIntoView([instance]);
      figma.currentPage.selection = [instance];
      figma.notify("Component instance created successfully!");
    } catch (error) {
      console.error("Error details:", error);
      figma.notify("Error creating component instance: " + error.message, { error: true });
    }
  }
  else if (msg.type === "goto-component") {
    try {
      // Navigate to component in current file
      const node = await figma.getNodeByIdAsync(msg.id);
      if (node) {
        const componentPage = node.parent.parent;
        await figma.setCurrentPageAsync(componentPage);
        figma.viewport.scrollAndZoomIntoView([node]);
        figma.currentPage.selection = [node];
        figma.notify("Navigated to component");
      }
    } catch (error) {
      figma.notify("Error navigating to component: " + error.message, { error: true });
    }
  }
  else if (msg.type === "live-update-property") {
    try {
      const instance = await figma.getNodeByIdAsync(msg.instanceId);

      if (instance && instance.type === "INSTANCE") {
        const setProps = {};

        // Set the property that changed
        Object.entries(msg.properties).forEach(([key, value]) => {
          if (instance.componentProperties && instance.componentProperties[key]) {
            // Add to the properties object
            setProps[key] = value;
          }
        });

        console.log("Live updating instance property:", setProps);
        if (Object.keys(setProps).length > 0) {
          instance.setProperties(setProps);
        }

        // If it's a variant property, the component might swap entirely
        // In that case, we need to re-fetch properties and update the UI
        if (Object.keys(setProps).some(key => {
          return instance.componentProperties[key] &&
                 instance.componentProperties[key].type === 'VARIANT';
        })) {
          // Wait a tiny bit for the component to update
          setTimeout(async () => {
            // Re-fetch the master component
            const masterComponent = instance.mainComponent;
            if (masterComponent) {
              const componentProperties = await getComponentProperties(
                masterComponent.parent ? masterComponent.parent.id : masterComponent.id,
                instance.id
              );

              figma.ui.postMessage({
                type: "show-component-properties",
                properties: componentProperties,
                instanceId: instance.id
              });
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error during live property update:", error);
      // Don't show notification for live updates to avoid disruption
    }
  }
  else if (msg.type === "clear-icons-cache") {
    // This is now redundant with the refresh button
    figma.notify("Use the refresh button to clear cache and reload icons", { timeout: 2000 });
    // Still clear the cache for backward compatibility
    cache.icons = null;
    try {
      await figma.clientStorage.deleteAsync('cachedIcons');
      await figma.clientStorage.deleteAsync('cachedIconsMetadata');
      loadIconComponentsFromCurrentFile();
    } catch (error) {
      console.error("Error clearing icons cache:", error);
      figma.notify("Error clearing icons cache: " + error.message, { error: true });
    }
  }
  else if (msg.type === "resize") {
    const size = msg.size === 'expanded' ? UI_SIZES.expanded : UI_SIZES.compact;
    figma.ui.resize(size.width, size.height);
    console.log(`Resizing UI to ${size.width}x${size.height}`);
  }
};

async function getComponentProperties(componentId, instanceId = null) {
  const node = await figma.getNodeByIdAsync(componentId);
  let instance = null;

  if (instanceId) {
    instance = await figma.getNodeByIdAsync(instanceId);
  }

  if (node) {
    let properties = {};

    if (node.type === "COMPONENT_SET" || node.type === "COMPONENT") {
      // Get all property definitions
      const componentProps = {};
      const nodeToCheck = node.type === "COMPONENT_SET" ? node : node;

      // Extract all property types from component property definitions
      if (nodeToCheck.componentPropertyDefinitions) {
        Object.entries(nodeToCheck.componentPropertyDefinitions).forEach(([key, def]) => {
          const currentValue = instance && instance.componentProperties[key] ?
            instance.componentProperties[key] : def.defaultValue;

          componentProps[key] = {
            type: def.type,
            defaultValue: def.defaultValue,
            currentValue: currentValue,
            variantOptions: def.type === 'VARIANT' ? def.variantOptions : null
          };
        });
      }

      properties = {
        type: node.type,
        id: node.id,
        name: node.name,
        instanceId: instanceId,
        componentProperties: componentProps
      };

      // Add variants list if it's a component set
      if (node.type === "COMPONENT_SET") {
        properties.variants = node.children.map(variant => ({
          id: variant.id,
          name: variant.name
        }));
      }
    }

    console.log("Component properties:", properties);
    return properties;
  }
  return null;
}

// Add drop event handler
figma.on('drop', async (event) => {
  const { items } = event;
  
  if (items.length > 0 && items[0].type === 'application/json') {
    try {
      const componentData = JSON.parse(items[0].data);
      const node = await figma.getNodeByIdAsync(componentData.id);
      
      if (node) {
        let instance;
        if (node.type === "COMPONENT_SET") {
          instance = node.defaultVariant.createInstance();
        } else if (node.type === "COMPONENT") {
          instance = node.createInstance();
        }

        if (instance) {
          instance.x = event.absoluteX;
          instance.y = event.absoluteY;
          figma.currentPage.appendChild(instance);
          figma.currentPage.selection = [instance];
        }
      }
    } catch (error) {
      console.error('Error creating instance from drop:', error);
    }
  }
  
  return false;
});