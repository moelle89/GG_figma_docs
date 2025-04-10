// Define the UI sizes at the top of the file
const UI_SIZES = {
  compact: { width: 240, height: 574 },
  expanded: { width: 280, height: 930 } // Use a taller, fixed size for expanded mode
};

// Include menuData definition directly in code.js
const defaultMenuData =   [
    {
      "category": "First Steps",
      "items": [
        "UI component lib",
        "Documentation",
        "Latest Components"
      ]
    },
    {
      "category": "Button",
      "items": [
        "Button",
        "Button Group",
        "Button Close",
        "Button with Icon Only",
        "Social Button",
        "Store Badges"
      ]
    },
    {
      "category": "Input Fields",
      "items": [
        "Input"
      ]
    },
    {
      "category": "Checkboxes",
      "items": [
        "Checkbox",
        "Checkbox Label"
      ]
    },
    {
      "category": "Radio Buttons",
      "items": [
        "Radio Button",
        "Radio Button Group"
      ]
    },
    {
      "category": "Toggles",
      "items": [
        "Toggle Switch",
        "Toggle Label"
      ]
    },
    {
      "category": "Drop-Downs",
      "items": [
        "Drop-Down List",
        "Drop-Down Box",
        "Drop-Down Button"
      ]
    },
    {
      "category": "Tabs",
      "items": [
        "Horizontal Tabs",
        "Vertical Tabs",
        "Tab Button"
      ]
    },
    {
      "category": "Modals",
      "items": [
        "Modal Header",
        "Modal Actions"
      ]
    },
    {
      "category": "Pagination",
      "items": [
        "Pagination",
        "Pagination Dots"
      ]
    },
    {
      "category": "Progress Loaders",
      "items": [
        "Linear Loader",
        "Linear Loader (Looping)",
        "Radial Loader",
        "Radial Loader (Looping)",
        "Radial Loader (Looping) 2"
      ]
    },
    {
      "category": "Badges & Tags",
      "items": [
        "Badge"
      ]
    },
    {
      "category": "Icons",
      "items": [
        "Icons",
        "Other Icons",
        "Featured Icon"
      ]
    },
    {
      "category": "Content",
      "items": [
        "Content Frames",
        "Content Slots",
        "Content Header",
        "Content Slot"
      ]
    },
    {
      "category": "Lists",
      "items": [
        "Check List Item",
        "Class List Item",
        "Menu List Item"
      ]
    },
    {
      "category": "Tables",
      "items": [
        "Table",
        "Table Cell"
      ]
    },
    {
      "category": "Accordion",
      "items": [
        "Accordion",
        "Accordion Item"
      ]
    },
    {
      "category": "Picker Dialogs",
      "items": [
        "Date Picker",
        "Color Picker"
      ]
    },
    {
      "category": "File Viewers and Editors",
      "items": [
        "Image Editor",
        "Image Editor / Toolbar",
        "Markdown Editor"
      ]
    },
    {
      "category": "eCommerce",
      "items": [
        "Product Card Horizontal",
        "Product Card Vertical"
      ]
    },
    {
      "category": "Headers",
      "items": [
        "Card Header",
        "Page Header",
        "Section Header"
      ]
    },
    {
      "category": "Dividers",
      "items": [
        "Divider"
      ]
    },
    {
      "category": "Info Cards",
      "items": [
        "Info Card"
      ]
    },
    {
      "category": "Empty States",
      "items": [
        "Empty State",
        "Empty State Graphic"
      ]
    },
    {
      "category": "Inbox",
      "items": [
        "Content / Inbox / Classic",
        "Content / Inbox / Compact",
        "Mail Navigation List Item"
      ]
    },
    {
      "category": "Signup & Login",
      "items": [
        "Login Sections",
        "Signup Sections"
      ]
    },
    {
      "category": "Logos",
      "items": [
        "GG Logo",
        "GG Logo Icon",
        "GG Logo Mark"
      ]
    },
    {
      "category": "Miscellaneous",
      "items": [
        "Avatar",
        "Avatar Labeled",
        "Avatar Stack",
        "AI Shortcuts",
        "AI Shortcuts Item",
        "Project Switch",
        "View Mode Picker"
      ]
    }
  ];

// Use defaultMenuData directly for menu structure
const menuData = defaultMenuData;

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

// Start by loading components from the current file
setTimeout(() => {
  loadComponentsFromCurrentFile();
  checkAndSendPlaygroundState(); // Check initial state
}, 100);

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
      // Count total components across all categories
      const totalComponents = cache.components.reduce((total, category) =>
        category.isCategory ? total + category.items.length : total, 0);

      figma.ui.postMessage({
        status: `Found ${totalComponents} components.`,
        components: cache.components
      });
      return;
    }

    // Then try to load from client storage
    const storedComponents = await loadFromClientStorage('cachedComponents');
    if (storedComponents) {
      cache.components = storedComponents;

      // Count total components across all categories
      const totalComponents = storedComponents.reduce((total, category) =>
        category.isCategory ? total + category.items.length : total, 0);

      figma.ui.postMessage({
        status: `Found ${totalComponents} components.`,
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

    // Create a map to store components by category
    const categorizedComponents = new Map();
    const uncategorizedComponents = [];

    // Initialize categories from menuData
    menuData.forEach(category => {
      categorizedComponents.set(category.category, []);
    });

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

        // Remove the "❖ " prefix from the component name for matching
        const cleanComponentName = component.name.replace('❖ ', '');

        const componentData = {
          id: component.id,
          name: cleanComponentName,
          thumbnail: base64Image
        };

        // Try to find a matching category
        let foundCategory = false;
        for (const category of menuData) {
          if (category.items.includes(cleanComponentName)) {
            categorizedComponents.get(category.category).push(componentData);
            foundCategory = true;
            break;
          }
        }

        // If no category found, add to uncategorized
        if (!foundCategory) {
          uncategorizedComponents.push(componentData);
        }

        formattedComponents.push(componentData);

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
        const componentData = {
          id: component.id,
          name: component.name.replace('❖ ', ''),
          colorHash: stringToColor(component.name),
          firstChar: component.name.replace('❖ ', '').charAt(0).toUpperCase()
        };

        // Try to find a matching category
        let foundCategory = false;
        for (const category of menuData) {
          if (category.items.includes(componentData.name)) {
            categorizedComponents.get(category.category).push(componentData);
            foundCategory = true;
            break;
          }
        }

        // If no category found, add to uncategorized
        if (!foundCategory) {
          uncategorizedComponents.push(componentData);
        }

        formattedComponents.push(componentData);
      }
    }

    // Store in both cache and client storage
    const categorizedComponentsArray = Array.from(categorizedComponents.entries())
      .map(([category, items]) => ({
        category,
        items,
        isCategory: true
      }));

    // Add uncategorized section if there are any uncategorized components
    if (uncategorizedComponents.length > 0) {
      categorizedComponentsArray.push({
        category: "Other Components",
        items: uncategorizedComponents,
        isCategory: true
      });
    }

    // Store the categorized array instead of the flat array
    cache.components = categorizedComponentsArray;
    await saveToClientStorage('cachedComponents', categorizedComponentsArray);

    // Show warning if any components failed to load
    if (failedComponents.length > 0) {
      figma.notify(`Warning: ${failedComponents.length} components failed to load thumbnails. Using fallback display.`, { timeout: 5000 });
    }

    figma.ui.postMessage({
      status: `Found ${components.length} components.`,
      components: categorizedComponentsArray
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

const PLAYGROUND_FRAME_ID_KEY = 'playgroundFrameId'; // Key for client storage
const LAST_VIEWPORT_X_KEY = 'lastViewportX';
const LAST_VIEWPORT_Y_KEY = 'lastViewportY';
const LAST_VIEWPORT_ZOOM_KEY = 'lastViewportZoom';

// Helper function to check and send playground state
async function checkAndSendPlaygroundState() {
  try {
    const existingFrameId = await figma.clientStorage.getAsync(PLAYGROUND_FRAME_ID_KEY);
    let exists = false;
    if (existingFrameId) {
      // Optionally verify the node still exists, though not strictly necessary for just the icon
      const existingFrame = await figma.getNodeByIdAsync(existingFrameId);
      if (existingFrame && !existingFrame.removed) {
        exists = true;
      } else if (!existingFrame) {
        // Clean up stale ID if node is gone
         await figma.clientStorage.deleteAsync(PLAYGROUND_FRAME_ID_KEY);
      }
    }
    figma.ui.postMessage({ type: 'playground-state', exists: exists });
  } catch (error) {
    console.error("Error checking playground state:", error);
    // Assume it doesn't exist in case of error
    figma.ui.postMessage({ type: 'playground-state', exists: false });
  }
}

// Handle UI messages
figma.ui.onmessage = async msg => {
  if (msg.type === "close") {
    figma.closePlugin();
  }
  else if (msg.type === "tab-change") {
    currentTab = msg.tab;
    checkAndSendPlaygroundState(); // Check state when tab changes

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
        // Count total components across all categories
        const totalComponents = cache.components.reduce((total, category) =>
          category.isCategory ? total + category.items.length : total, 0);

        figma.ui.postMessage({
          status: `Found ${totalComponents} components.`,
          components: cache.components
        });
      }

      // Send the collapsed categories state
      const collapsedState = await loadFromClientStorage('collapsedCategories') || {};
      figma.ui.postMessage({
        type: 'collapsed-state',
        collapsedCategories: collapsedState
      });
    }
  }
  else if (msg.type === "save-collapsed-state") {
    // Save collapsed state to client storage
    await saveToClientStorage('collapsedCategories', msg.collapsedCategories);
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
            const masterComponent = await instance.getMainComponentAsync();
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
  else if (msg.type === "get-selected-links") {
    getSelectedElementLinks();
  }
  else if (msg.type === "create-playground") {
    await createPlaygroundFrame();
  }
  else if (msg.type === "return-decision") { // Handler for dialog choice
    await handleReturnDecision(msg.choice);
  }
};

// Add this handler for the new feature
async function getSelectedElementLinks() {
  const selectedNodes = figma.currentPage.selection;
  const links = [];

  if (selectedNodes.length === 0) {
    figma.ui.postMessage({ type: 'show-links-dialog', links: [] });
    figma.notify("Please select one or more elements.");
    return;
  }

  // Get document ID from documentAsString
  // This is a more reliable method than figma.fileKey in some contexts
  let fileKey = null;

  try {
    // Try both methods to get the file key/ID
    if (figma.fileKey) {
      fileKey = figma.fileKey;
    } else if (figma.root && figma.root.id) {
      // Fallback to node ID of root
      fileKey = figma.root.id.split(':')[0];
    }

    // Check if we successfully got a file key
    if (fileKey) {
      // Generate links with file key
      for (const node of selectedNodes) {
        try {
          // Format the node ID like Figma does
          const cleanNodeId = node.id.replace(':', '-');

          // Get a random token for the 't' parameter in the URL (this may change but isn't critical)
          const randomToken = Math.random().toString(36).substring(2, 15);

          // Construct the URL to match Figma's "Copy Link to Selection" format
          const nodeUrl = `https://www.figma.com/file/${fileKey}/${encodeURIComponent(figma.root.name)}?node-id=${cleanNodeId}&t=${randomToken}-0`;

          links.push({
            id: node.id,
            name: node.name,
            url: nodeUrl
          });
        } catch (error) {
          console.error(`Error generating link for node ${node.name}:`, error);
        }
      }
    } else {
      // No file key means the file might not be saved/published yet
      // Create informational placeholder links
      for (const node of selectedNodes) {
        links.push({
          id: node.id,
          name: node.name,
          url: `#${node.id}`,
          isPlaceholder: true
        });
      }

      // Throw an error to show the message about how to get real links
      throw new Error("File key not available");
    }
  } catch (error) {
    console.warn("Could not generate proper Figma links:", error);

    if (links.length === 0) {
      // Create at least placeholder links with node IDs if we have no links at all
      for (const node of selectedNodes) {
        links.push({
          id: node.id,
          name: node.name,
          url: `#${node.id}`,
          isPlaceholder: true
        });
      }
    }

    // Send a message along with the links indicating they're placeholders
    figma.ui.postMessage({
      type: 'show-links-dialog',
      links: links,
      error: "Could not generate full Figma links. Try using Figma's built-in 'Copy Link to Selection' (Ctrl+L) instead."
    });

    figma.notify("Unable to generate proper Figma links. Try using Figma's 'Copy Link to Selection' (Ctrl+L) instead.", { timeout: 5000 });
    return;
  }

  figma.ui.postMessage({ type: 'show-links-dialog', links: links });

  if (links.length > 0) {
    figma.notify(`Generated ${links.length} link${links.length > 1 ? 's' : ''}.`, { timeout: 2000 });
  }
}

// Helper function to calculate the bounding box of multiple nodes
function calculateOverallBounds(nodes) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  nodes.forEach(node => {
    // Basic check to ignore nodes without dimensions or position (like Guides)
    if (typeof node.x === 'number' && typeof node.y === 'number' && typeof node.width === 'number' && typeof node.height === 'number') {
      const nodeMaxX = node.x + node.width;
      const nodeMaxY = node.y + node.height;

      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, nodeMaxX);
      maxY = Math.max(maxY, nodeMaxY);
    }
  });

  // If no valid nodes were found to calculate bounds
  if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
    return null;
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

// Modified function to create/toggle the playground frame
async function createPlaygroundFrame() {
  // --- Check for existing playground frame ---
  try {
    const existingFrameId = await figma.clientStorage.getAsync(PLAYGROUND_FRAME_ID_KEY);
    if (existingFrameId) {
      const existingFrame = await figma.getNodeByIdAsync(existingFrameId);
      if (existingFrame && !existingFrame.removed && existingFrame.type === 'FRAME') { // Ensure it's a frame
        // Frame exists, show dialog instead of immediate deletion
        figma.ui.postMessage({ type: 'show-return-dialog' });
        return; // Stop here, wait for user choice via handleReturnDecision
      } else {
        // If frame ID exists but frame is gone or not a frame, clear the stored ID and any lingering viewport data
        await figma.clientStorage.deleteAsync(PLAYGROUND_FRAME_ID_KEY);
        await figma.clientStorage.deleteAsync(LAST_VIEWPORT_X_KEY).catch(()=>{});
        await figma.clientStorage.deleteAsync(LAST_VIEWPORT_Y_KEY).catch(()=>{});
        await figma.clientStorage.deleteAsync(LAST_VIEWPORT_ZOOM_KEY).catch(()=>{});
      }
    }
  } catch (error) {
    console.error("Error checking existing playground frame:", error);
    // Clear potentially stale keys if error occurs during check
    await figma.clientStorage.deleteAsync(PLAYGROUND_FRAME_ID_KEY).catch(() => {});
    await figma.clientStorage.deleteAsync(LAST_VIEWPORT_X_KEY).catch(()=>{});
    await figma.clientStorage.deleteAsync(LAST_VIEWPORT_Y_KEY).catch(()=>{});
    await figma.clientStorage.deleteAsync(LAST_VIEWPORT_ZOOM_KEY).catch(()=>{});
  }

  // --- If no existing frame was found, proceed to create a new one ---
  const selection = figma.currentPage.selection;

  if (selection.length !== 1) {
    figma.notify("Please select a single component, variant, or instance to create a playground.");
    return;
  }

  const selectedNode = selection[0];
  let nodeToInstance = null;
  let componentName = 'Component'; // Default name

  try {
    // --- Determine node to instance ---
    if (selectedNode.type === "INSTANCE") {
      nodeToInstance = selectedNode.clone();
      const mainComponent = await selectedNode.getMainComponentAsync();
      componentName = mainComponent ? mainComponent.name : 'Instance';
    } else if (selectedNode.type === "COMPONENT") {
      nodeToInstance = selectedNode.createInstance();
      componentName = selectedNode.name;
    } else if (selectedNode.type === "COMPONENT_SET") {
      const defaultVariant = selectedNode.defaultVariant;
      if (defaultVariant) {
        nodeToInstance = defaultVariant.createInstance();
        componentName = selectedNode.name;
      } else {
        figma.notify("Could not find a default variant for this component set.", { error: true });
        return;
      }
    } else {
      figma.notify("Selected element must be a component, variant, or instance.");
      return;
    }

    if (!nodeToInstance) {
      figma.notify("Failed to create an instance of the selected component.", { error: true });
      return;
    }

    // --- Store current viewport BEFORE creating and navigating ---
    const currentViewport = {
        x: figma.viewport.center.x,
        y: figma.viewport.center.y,
        zoom: figma.viewport.zoom
    };
    try {
        await figma.clientStorage.setAsync(LAST_VIEWPORT_X_KEY, currentViewport.x);
        await figma.clientStorage.setAsync(LAST_VIEWPORT_Y_KEY, currentViewport.y);
        await figma.clientStorage.setAsync(LAST_VIEWPORT_ZOOM_KEY, currentViewport.zoom);
    } catch (e) {
        console.error("Failed to save viewport state:", e);
        figma.notify("Warning: Could not save current location state.", { timeout: 3000 });
    }

    // --- Frame Creation & Sizing ---
    const frame = figma.createFrame();
    frame.name = `Playground - ${componentName.replace('❖ ', '')}`;
    frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

    // Get instance dimensions AFTER creation/cloning
    const instanceWidth = nodeToInstance.width;
    const instanceHeight = nodeToInstance.height;
    const padding = 100; // Whitespace around the instance

    // Calculate dynamic frame size
    const frameWidth = instanceWidth + 2 * padding;
    const frameHeight = instanceHeight + 2 * padding;
    frame.resize(frameWidth, frameHeight);

    // --- Instance Placement (Centered within Frame) ---
    frame.appendChild(nodeToInstance);
    nodeToInstance.x = padding; // Position instance using padding
    nodeToInstance.y = padding;

    // --- Frame Positioning (Avoid Overlap) ---
    const allNodes = figma.currentPage.children;
    const otherNodes = allNodes.filter(n => n.id !== frame.id); // Exclude the frame itself
    const bounds = calculateOverallBounds(otherNodes);

    let frameX, frameY;

    if (bounds) {
      // Position 100px to the right of all existing content
      frameX = bounds.x + bounds.width + 100;
      frameY = bounds.y; // Align top with the top of existing content bounds
    } else {
      // If canvas is empty or no bounds calculable, place near viewport center
      frameX = figma.viewport.center.x - frameWidth / 2;
      frameY = figma.viewport.center.y - frameHeight / 2;
    }

    frame.x = frameX;
    frame.y = frameY;

    // --- Final Steps ---
    figma.currentPage.appendChild(frame); // Add to page (might already be added implicitly by createFrame, but explicit is safe)

    // Store the new frame's ID
    await figma.clientStorage.setAsync(PLAYGROUND_FRAME_ID_KEY, frame.id);
    await checkAndSendPlaygroundState(); // Send updated state (true)

    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]); // Move user's view to the new frame
    figma.notify(`Created playground frame for '${componentName.replace('❖ ', '')}'`);

  } catch (error) {
    console.error("Error creating playground frame:", error);
    figma.notify("Error creating playground frame: " + error.message, { error: true });
    if (nodeToInstance && !nodeToInstance.removed) {
        nodeToInstance.remove();
    }
    await checkAndSendPlaygroundState(); // Ensure state is updated even on error
    // Clear stored viewport if creation failed
    await figma.clientStorage.deleteAsync(LAST_VIEWPORT_X_KEY).catch(()=>{});
    await figma.clientStorage.deleteAsync(LAST_VIEWPORT_Y_KEY).catch(()=>{});
    await figma.clientStorage.deleteAsync(LAST_VIEWPORT_ZOOM_KEY).catch(()=>{});
  }
}

// New function to handle the user's choice from the dialog
async function handleReturnDecision(choice) {
  const frameId = await figma.clientStorage.getAsync(PLAYGROUND_FRAME_ID_KEY);
  let lastX = null, lastY = null, lastZoom = null;

  // Retrieve viewport data regardless of choice, as we need to clear it
  try {
      lastX = await figma.clientStorage.getAsync(LAST_VIEWPORT_X_KEY);
      lastY = await figma.clientStorage.getAsync(LAST_VIEWPORT_Y_KEY);
      lastZoom = await figma.clientStorage.getAsync(LAST_VIEWPORT_ZOOM_KEY);
  } catch (e) {
      console.error("Error retrieving viewport data for return:", e);
  }

  // Delete the frame if it exists
  if (frameId) {
    const frame = await figma.getNodeByIdAsync(frameId);
    if (frame && !frame.removed) {
      frame.remove();
    }
  }

  // Clear storage keys
  await figma.clientStorage.deleteAsync(PLAYGROUND_FRAME_ID_KEY).catch(e => console.error("Failed to delete frame ID:", e));
  await figma.clientStorage.deleteAsync(LAST_VIEWPORT_X_KEY).catch(e => console.error("Failed to delete viewport X:", e));
  await figma.clientStorage.deleteAsync(LAST_VIEWPORT_Y_KEY).catch(e => console.error("Failed to delete viewport Y:", e));
  await figma.clientStorage.deleteAsync(LAST_VIEWPORT_ZOOM_KEY).catch(e => console.error("Failed to delete viewport Zoom:", e));

  // Update UI button state
  await checkAndSendPlaygroundState(); // Will now be false

  if (choice === 'go-back') {
    if (typeof lastX === 'number' && typeof lastY === 'number' && typeof lastZoom === 'number') {
      figma.viewport.center = { x: lastX, y: lastY };
      figma.viewport.zoom = lastZoom;
      figma.notify("Returned to previous location.");
    } else {
       figma.notify("Could not retrieve previous location data.");
    }
  } else {
     figma.notify("Playground frame removed."); // Notify even if staying
  }
}

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