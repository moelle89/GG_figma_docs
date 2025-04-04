figma.showUI(__html__, {
  width: 280,
  height: 860,
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

  try {
    figma.ui.postMessage({ status: "Loading components from current file..." });

    await figma.loadAllPagesAsync();

    // Look for a page named "COMPONENTS"
    const componentsPage = figma.root.children.find(page => page.name === "COMPONENTS");

    if (!componentsPage) {
      figma.ui.postMessage({
        error: "No COMPONENTS page found in the current file.",
        components: []
      });
      return;
    }

    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    // Find components with the ❖ prefix
    const components = componentsPage.findAll(node =>
      (node.type === "COMPONENT" || node.type === "COMPONENT_SET") && node.name.startsWith("❖ ")
    );

    if (components.length === 0) {
      figma.ui.postMessage({
        error: "No components with ❖ prefix found on the COMPONENTS page.",
        components: []
      });
      return;
    }

    // Process components in smaller batches
    const BATCH_SIZE = 3;
    const formattedComponents = [];

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
          constraint: { type: "SCALE", value: 2 }
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

    figma.ui.postMessage({
      status: `Found ${components.length} components.`,
      components: formattedComponents
    });
  } catch (error) {
    console.error("Error loading current file components:", error);
    figma.ui.postMessage({
      error: "Error loading components: " + error.message,
      components: []
    });
  }
}

// Function to load icons from the current file
async function loadIconComponentsFromCurrentFile() {
  if (cache.icons) {
    console.log("Using memory cache for icons", cache.icons.length);
    figma.ui.postMessage({
      iconsStatus: `Found ${cache.icons.length} icons.`,
      icons: cache.icons
    });
    return;
  }

  const storedIcons = await loadFromClientStorage('cachedIcons');
  if (storedIcons) {
    console.log("Using stored cache for icons", storedIcons.length);
    cache.icons = storedIcons;
    figma.ui.postMessage({
      iconsStatus: `Found ${storedIcons.length} icons.`,
      icons: storedIcons
    });
    return;
  }

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

        // Export the component as a PNG
        const exportSettings = {
          format: "PNG",
          constraint: { type: "SCALE", value: 2 }
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
    await saveToClientStorage('cachedIcons', formattedComponents);

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
    await figma.clientStorage.deleteAsync('cachedIcons');
    loadIconComponentsFromCurrentFile();
  } else {
    // Refresh all
    cache.components = null;
    cache.icons = null;
    await figma.clientStorage.deleteAsync('cachedComponents');
    await figma.clientStorage.deleteAsync('cachedIcons');
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

      // Instead of immediately creating the instance, send properties to UI
      const componentProperties = await getComponentProperties(msg.id);
      figma.ui.postMessage({
        type: "show-component-properties",
        properties: componentProperties
      });
    } catch (error) {
      figma.notify("Error getting component properties: " + error.message, { error: true });
    }
  }
  else if (msg.type === "create-instance-with-properties") {
    try {
      const node = await figma.getNodeByIdAsync(msg.componentId);
      let instance;

      if (node.type === "COMPONENT_SET") {
        // Debug logging
        console.log("Component Set:", node.name);
        console.log("Component Property Definitions:", node.componentPropertyDefinitions);

        // Find the variant that matches the selected properties
        const variant = node.children.find(child => {
          // Get the variant name which contains the property values
          const variantName = child.name;
          console.log("Checking variant:", variantName);

          // Parse the variant name (format is typically "Property=Value")
          const variantProperties = variantName.split(", ").reduce((acc, pair) => {
            const [key, value] = pair.split("=");
            acc[key] = value;
            return acc;
          }, {});

          console.log("Parsed variant properties:", variantProperties);
          console.log("Requested properties:", msg.properties);

          // Check if all requested properties match
          return Object.entries(msg.properties).every(([key, value]) =>
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
};

async function getComponentProperties(componentId) {
  const node = await figma.getNodeByIdAsync(componentId);
  if (node) {
    let properties = {};

    if (node.type === "COMPONENT_SET") {
      // Get the property definitions from the component set
      const variantProperties = {};

      // Extract variant properties from component property definitions
      if (node.componentPropertyDefinitions) {
        Object.entries(node.componentPropertyDefinitions).forEach(([key, def]) => {
          if (def.type === 'VARIANT') {
            variantProperties[key] = {
              type: def.type,
              defaultValue: def.defaultValue,
              variantOptions: def.variantOptions
            };
          }
        });
      }

      properties = {
        type: "COMPONENT_SET",
        id: node.id,
        name: node.name,
        variantProperties: variantProperties,
        variants: node.children.map(variant => ({
          id: variant.id,
          name: variant.name
        }))
      };
    } else if (node.type === "COMPONENT") {
      properties = {
        type: "COMPONENT",
        id: node.id,
        name: node.name,
        properties: node.componentPropertyDefinitions
      };
    }

    console.log("Component properties:", properties);
    return properties;
  }
  return null;
}