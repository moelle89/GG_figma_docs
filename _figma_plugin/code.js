// Define the UI sizes at the top of the file
const UI_SIZES = {
  compact: { width: 240, height: 574 },
  expanded: { width: 280, height: 930 } // Use a taller, fixed size for expanded mode
};

// Include menuData definition directly in code.js
const defaultMenuData =         [
    {
      "category": "First Steps",
      "items": [
        "UI component lib",
        "Latest Components",
        "Documentation",
        "Figma Plugin"
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

// Cache for storing loaded components and icons
const cache = {
  components: null,
  icons: null,
  navigationSections: null // Add cache for navigation sections
};

// Flag to track UI readiness
let isUiReady = false;
let pendingUpdateMessage = null; // Store pending update message if UI is not ready

// Send category list to UI, filtering out 'First Steps' - REMOVED THIS PREMATURE CALL
// const categoryNames = menuData
//   .map(cat => cat.category)
//   .filter(name => name !== "First Steps");
// figma.ui.postMessage({ type: 'category-list', categories: categoryNames });

// Use the compact size as default in the showUI call
figma.showUI(__html__, {
  width: UI_SIZES.compact.width,
  height: UI_SIZES.compact.height,
  themeColors: true
});
// ===================================
let currentTab = "components-tab";

// Start by loading components from the current file - REMOVED FROM HERE
// setTimeout(() => {
//   loadComponentsFromCurrentFile();
//   checkAndSendPlaygroundState(); // Check initial state
// }, 100);

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

      // Prefetch navigation sections if needed
      if (!cache.navigationSections) {
        await prefetchNavigationSections();
      }

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

    // Prefetch navigation sections after loading components
    await prefetchNavigationSections();

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
  console.log(`Refreshing cache for type: "${type}"`);

  if (type === 'components') {
    console.log('Clearing components cache...');
    cache.components = null;
    cache.navigationSections = null; // Also clear navigation sections cache
    await figma.clientStorage.deleteAsync('cachedComponents');
    console.log('Loading components from file...');
    loadComponentsFromCurrentFile();
  } else if (type === 'icons') {
    console.log('Clearing icons cache...');
    cache.icons = null;
    // Clear both full icons and metadata cache if it exists
    await figma.clientStorage.deleteAsync('cachedIcons');
    await figma.clientStorage.deleteAsync('cachedIconsMetadata');
    figma.notify("Icons cache cleared, reloading icons...");
    console.log('Loading icons from file...');
    loadIconComponentsFromCurrentFile();
  } else {
    // Refresh all
    console.log('Clearing all caches...');
    cache.components = null;
    cache.icons = null;
    cache.navigationSections = null; // Also clear navigation sections cache
    await figma.clientStorage.deleteAsync('cachedComponents');
    await figma.clientStorage.deleteAsync('cachedIcons');
    await figma.clientStorage.deleteAsync('cachedIconsMetadata');
    console.log('Loading all content from file...');
    loadComponentsFromCurrentFile();
    loadIconComponentsFromCurrentFile();
  }
}

const PLAYGROUND_FRAME_ID_KEY = 'playgroundFrameId'; // Key for client storage
const LAST_VIEWPORT_X_KEY = 'lastViewportX';
const LAST_VIEWPORT_Y_KEY = 'lastViewportY';
const LAST_VIEWPORT_ZOOM_KEY = 'lastViewportZoom';

// Add flag to prevent duplicate creation
let isCreatingPlayground = false;

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
  // --- Add ui-ready handler ---
  else if (msg.type === 'ui-ready') {
    isUiReady = true; // Mark UI as ready
    console.log("UI is ready.");

    // Now that UI is ready, send initial data and load components
    // Send the *filtered* category list again when UI is ready
    const categoryNamesFiltered = menuData
      .map(cat => cat.category)
      .filter(name => name !== "First Steps");
    figma.ui.postMessage({ type: 'category-list', categories: categoryNamesFiltered });

    loadComponentsFromCurrentFile();
    checkAndSendPlaygroundState();

    // Send any pending update message now that UI is ready
    if (pendingUpdateMessage) {
      console.log("Sending pending update message to UI.");
      figma.ui.postMessage(pendingUpdateMessage);
      pendingUpdateMessage = null; // Clear the pending message
    }
  }
  // --- End ui-ready handler ---
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
    console.log(`Refresh requested with target: "${msg.target}"`);

    if (!msg.target || (msg.target !== 'components' && msg.target !== 'icons')) {
      console.warn(`Invalid refresh target: ${msg.target}, defaulting to refresh all`);
      refreshCache('all');
      figma.notify("Refreshing all components and icons...");
    } else {
      refreshCache(msg.target);
      figma.notify(`Refreshing ${msg.target}...`);
    }
  }

  // --- Add create-section-prompt handler ---
  else if (msg.type === "create-section-prompt") {
    showSectionNameDialog();
  }
  // --- End create-section-prompt handler ---

  else if (msg.type === "create-section-with-name") {
    // This handler receives the section name from the UI dialog
    if (msg.sectionName) {
      await createSectionWithHeader(msg.sectionName);
    } else {
      figma.notify("Section creation cancelled", { timeout: 2000 });
    }
  }
  // --- End create-section-with-name handler ---

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
        // Find the page by traversing up the node hierarchy
        let currentNode = node;
        let componentPage = null;

        while (currentNode.parent) {
          if (currentNode.parent.type === "PAGE") {
            componentPage = currentNode.parent;
            break;
          }
          currentNode = currentNode.parent;
        }

        if (!componentPage) {
          throw new Error("Could not locate the component's page");
        }

        await figma.setCurrentPageAsync(componentPage);
        figma.viewport.scrollAndZoomIntoView([node]);
        figma.currentPage.selection = [node];
        figma.notify("Navigated to component");
      } else {
        throw new Error("Component not found");
      }
    } catch (error) {
      console.error("Error navigating to component:", error);
      figma.notify("Error navigating to component: " + (error.message || "unknown error"), { error: true });
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
    // Check if we're already processing a playground creation - ignore duplicate requests
    if (isCreatingPlayground) {
      console.log("Ignoring duplicate playground creation request - already processing");
      return;
    }

    // Set flag and process
    isCreatingPlayground = true;

    try {
      await createPlaygroundFrame();
    } finally {
      // Always clear the flag when done, even if there was an error
      isCreatingPlayground = false;
    }
  }
  else if (msg.type === "return-decision") { // Handler for dialog choice
    await handleReturnDecision(msg.choice);
  }
  // --- Add navigate-to-category handler ---
  else if (msg.type === "navigate-to-category") {
      await navigateToCategory(msg.categoryName);
  }
  // --- End navigate-to-category handler ---

  // --- Add create-section-with-header handler ---
  else if (msg.type === 'create-section-with-header') {
    await createSectionWithHeader(msg.name);
  }
  // --- End create-section-with-header handler ---
};

// Function to generate a TypeScript interface from component properties
function generateTypeScriptInterface(componentNode) {
    if (!componentNode || !componentNode.name) {
        return null;
    }

    // Original name, prefix removed
    const cleanName = componentNode.name.replace(/❖\s*/, '');

    // --- Generate Filename ---
    // Replace spaces with hyphens, convert to lowercase, remove invalid chars
    const filenameBase = cleanName
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric/non-hyphen
        .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
    const filename = `${filenameBase || 'component'}.ts`; // Use 'component' as fallback

    // --- Generate Interface Name ---
    // Remove spaces/hyphens/invalid chars, convert to PascalCase
    const interfaceNameBase = cleanName
        .replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric
    let interfaceName = interfaceNameBase.charAt(0).toUpperCase() + interfaceNameBase.slice(1);
    if (!/^[a-zA-Z]/.test(interfaceName)) { // Ensure it starts with a letter
      interfaceName = `Component${interfaceName}`;
    }
    // If after sanitization the name is empty, use a default
    if (!interfaceName) {
        interfaceName = 'ComponentInterface';
    }


    // --- Generate Interface Content ---
    let interfaceContent = '';
    let propertiesAdded = false;
    let needsReactNodeImport = false;
    const definitions = componentNode.componentPropertyDefinitions;

    if (definitions) {
        // --- Custom Sorting Logic ---
        let priorityKey = null;
        const otherKeys = [];
        const priorityNames = ['variant', 'type', 'state'];

        Object.keys(definitions).forEach(key => {
            const def = definitions[key];
            const propBaseName = key.split('#')[0].toLowerCase();
            // Check if it's a priority VARIANT and we haven't found one yet
            if (priorityKey === null && def.type === 'VARIANT' && priorityNames.includes(propBaseName)) {
                priorityKey = key;
            } else {
                otherKeys.push(key);
            }
        });

        // Sort the remaining keys alphanumerically
        otherKeys.sort();

        // Combine priority key (if found) with sorted other keys
        const finalSortedKeys = priorityKey ? [priorityKey, ...otherKeys] : otherKeys;
        // --- End Custom Sorting ---

        // Iterate using the final sorted order
        finalSortedKeys.forEach(key => {
            const def = definitions[key];
            // Property name sanitization remains the same (camelCase)
            let propName = key.split('#')[0];
            propName = propName.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[^a-zA-Z_]+/, '_');
            propName = propName.replace(/_([a-zA-Z])/g, (g) => g[1].toUpperCase());
            propName = propName.charAt(0).toLowerCase() + propName.slice(1);
            if (!/^[a-zA-Z]/.test(propName)) { // Ensure prop starts with letter
                propName = `prop${propName.charAt(0).toUpperCase() + propName.slice(1)}`;
            }


            let propType = 'any'; // Default type

            switch (def.type) {
                case 'VARIANT':
                    propType = (def.variantOptions && Array.isArray(def.variantOptions))
                               ? def.variantOptions.map(opt => `'${opt.replace(/'/g, "\\'")}'`).join(' | ')
                               : 'string';
                    break;
                case 'BOOLEAN':
                    propType = 'boolean';
                    break;
                case 'TEXT':
                    propType = 'string';
                    break;
                case 'INSTANCE_SWAP':
                    propType = 'ReactNode';
                    needsReactNodeImport = true;
                    break;
            }
            // Revert: Make standard properties required again
            const isRequired = ['VARIANT', 'BOOLEAN', 'TEXT', 'INSTANCE_SWAP'].includes(def.type);
            interfaceContent += `\t${propName}${isRequired ? '' : '?'}: ${propType};\n`; // Note: isRequired will likely always be true now based on the types included
            propertiesAdded = true;
        });
    }

    if (!propertiesAdded) {
       // Return null if no properties processed
        return null;
    }

    let finalContent = '';
    if (needsReactNodeImport) {
        finalContent += `import type { ReactNode } from 'react';\n\n`;
    }
    finalContent += `export interface ${interfaceName} {\n${interfaceContent}}`;

    return { filename, content: finalContent };
}

// Add this handler for the new feature
async function getSelectedElementLinks() {
  const selectedNodes = figma.currentPage.selection;
  const links = [];
  let fileKey = null;

  if (selectedNodes.length === 0) {
    figma.ui.postMessage({ type: 'show-links-dialog', links: [] });
    figma.notify("Please select one or more elements.");
    return;
  }

  try {
    if (figma.fileKey) {
      fileKey = figma.fileKey;
    } else if (figma.root && figma.root.id) {
      fileKey = figma.root.id.split(':')[0];
    }

    for (const node of selectedNodes) {
        let linkInfo = {
            id: node.id,
            name: node.name || 'Unnamed Element',
            url: `#${node.id}`,
            isPlaceholder: true,
            tsFilename: null,
            tsContent: null
        };

        if (fileKey) {
            try {
                const cleanNodeId = node.id.replace(':', '-');
                const randomToken = Math.random().toString(36).substring(2, 15);
                linkInfo.url = `https://www.figma.com/file/${fileKey}/${encodeURIComponent(figma.root.name)}?node-id=${cleanNodeId}&t=${randomToken}-0`;
                linkInfo.isPlaceholder = false;
            } catch (error) {
                console.error(`Error generating link URL for node ${node.name}:`, error);
                linkInfo.isPlaceholder = true;
            }
        }

        try {
             let componentNode = null;
             if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
                 componentNode = node;
             } else if (node.type === 'INSTANCE') {
                 const mainComponent = await node.getMainComponentAsync();
                 if (mainComponent) {
                     if (mainComponent.type === 'COMPONENT' || mainComponent.type === 'COMPONENT_SET') {
                        componentNode = mainComponent;
                     } else {
                         console.warn(`Main component for instance ${node.name} is not a Component or ComponentSet: ${mainComponent.type}`);
                     }
                 } else {
                    console.warn(`Could not get main component for instance ${node.name}`);
                 }
             }

             if (componentNode) {
                 const tsData = generateTypeScriptInterface(componentNode);
                 if (tsData) {
                     linkInfo.tsFilename = tsData.filename;
                     linkInfo.tsContent = tsData.content;
                 }
             }
        } catch (tsError) {
             console.warn(`Could not generate TS interface for ${node.name}:`, tsError);
        }

        links.push(linkInfo);
    }

    if (!fileKey) {
        throw new Error("File key not available to generate full Figma links.");
    }

  } catch (error) {
    console.warn("Could not generate proper Figma links or TS interfaces:", error);
    if (links.length === 0 && selectedNodes.length > 0) {
         selectedNodes.forEach(node => {
             links.push({
                 id: node.id,
                 name: node.name || 'Unnamed Element',
                 url: `#${node.id}`,
                 isPlaceholder: true,
                 tsFilename: null,
                 tsContent: null
             });
         });
    }
    figma.ui.postMessage({
        type: 'show-links-dialog',
        links: links,
        error: "Could not generate full Figma links. Try using Figma's 'Copy Link to Selection' (Ctrl+L). TS export might also be unavailable."
    });
    figma.notify("Unable to generate proper Figma links. TS export might be affected.", { timeout: 5000 });
    return;
  }

  figma.ui.postMessage({ type: 'show-links-dialog', links: links });
  if (links.length > 0) {
    const realLinksCount = links.filter(l => !l.isPlaceholder).length;
    const tsExportCount = links.filter(l => l.tsFilename).length;
    let notifyMsg = `Generated ${realLinksCount} link${realLinksCount !== 1 ? 's' : ''}.`;
    if (tsExportCount > 0) {
       notifyMsg += ` ${tsExportCount} component${tsExportCount !== 1 ? 's' : ''} ready for TS export.`
    }
    figma.notify(notifyMsg, { timeout: 3000 });
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
    figma.notify("Please select a single element to create a playground.");
    return;
  }

  const selectedNode = selection[0];
  let nodeToPlaceInFrame = null;
  let nodeName = selectedNode.name || 'Element'; // Use selected node name

  try {
    // --- Determine what node to use and what action to perform ---
    console.log(`Selected node: ${nodeName} (Type: ${selectedNode.type})`);

    let nodeToUse = null;
    let actionToPerform = 'clone'; // Default to clone for non-components

    if (selectedNode.type === 'COMPONENT_SET') {
      // Selected the whole set, use its default variant for creating an instance
      console.log('Selected node is a COMPONENT_SET, using default variant.');
      nodeToUse = selectedNode.defaultVariant;
      if (nodeToUse) {
        nodeName = nodeToUse.name || 'Default Variant'; // Update name for the frame
        actionToPerform = 'createInstance';
      } else {
        figma.notify("Could not find default variant for the selected component set.", { error: true });
        return;
      }
    } else if (selectedNode.type === 'COMPONENT') {
      // Selected a specific component node
      nodeToUse = selectedNode;
      actionToPerform = 'createInstance'; // Always create instance for components
      if (selectedNode.parent && selectedNode.parent.type === 'COMPONENT_SET') {
        // It's a variant, use its own name for the frame
        console.log(`Selected node is a COMPONENT variant (part of ${selectedNode.parent.name}).`);
        nodeName = selectedNode.name;
      } else {
        // It's a standalone component
        console.log('Selected node is a standalone COMPONENT.');
        nodeName = selectedNode.name;
      }
    } else {
      // For all other node types (Frame, Group, etc.), use the selection directly and clone
      console.log('Selected node is not a component or set, using it directly for cloning.');
      nodeToUse = selectedNode;
      actionToPerform = 'clone';
    }

    // Ensure we have a node to use
    if (!nodeToUse) {
      figma.notify("Could not determine the node to place in the playground.", { error: true });
      return;
    }

    // --- Perform the determined action (clone or createInstance) ---
    console.log(`Action to perform: ${actionToPerform}`);
    if (actionToPerform === 'createInstance') {
       if (typeof nodeToUse.createInstance !== 'function') {
         figma.notify(`Error: Cannot create instance of node type ${nodeToUse.type}.`, { error: true });
         console.error("Attempted to createInstance on non-component node:", nodeToUse);
         return;
       }
       nodeToPlaceInFrame = nodeToUse.createInstance();
    } else { // actionToPerform === 'clone'
       if (typeof nodeToUse.clone !== 'function') {
         figma.notify(`Error: Cannot clone node type ${nodeToUse.type}.`, { error: true });
         console.error("Attempted to clone uncloneable node:", nodeToUse);
         return;
       }
       nodeToPlaceInFrame = nodeToUse.clone();
    }

    if (!nodeToPlaceInFrame) {
      const errorMsg = actionToPerform === 'createInstance' ? "Failed to create instance." : "Failed to clone element.";
      figma.notify(errorMsg, { error: true });
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
    const frame = figma.createRectangle();
    frame.name = `Playground - ${nodeName.replace('❖ ', '')}`;
    frame.fills = [{ type: 'SOLID', color: { r: 228 / 255, g: 228 / 255, b: 228 / 255 } }];

    // Get cloned node dimensions AFTER creation/cloning
    const nodeWidth = nodeToPlaceInFrame.width;
    const nodeHeight = nodeToPlaceInFrame.height;
    const padding = 300; // Whitespace around the node

    // Calculate dynamic frame size
    const frameWidth = nodeWidth + 2 * padding;
    const frameHeight = nodeHeight + 2 * padding;
    frame.resize(frameWidth, frameHeight);

    // --- Node Placement (Centered within Frame) ---
    frame.appendChild(nodeToPlaceInFrame);
    nodeToPlaceInFrame.x = padding; // Position node using padding
    nodeToPlaceInFrame.y = padding;

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

    // Select the cloned node inside the frame
    figma.currentPage.selection = [nodeToPlaceInFrame];
    // Scroll and zoom to the node
    figma.viewport.scrollAndZoomIntoView([nodeToPlaceInFrame]);
    figma.notify(`Created playground frame for '${nodeName.replace('❖ ', '')}'`);

  } catch (error) {
    console.error("Error creating playground frame:", error);
    figma.notify("Error creating playground frame: " + error.message, { error: true });
    if (nodeToPlaceInFrame && !nodeToPlaceInFrame.removed) {
        nodeToPlaceInFrame.remove();
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
  let frameRemoved = false; // Flag to track if frame was actually removed

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
    if (frame && !frame.removed && frame.type === 'FRAME') {

      // --- Select content and notify user to copy ---
      if (frame.children.length > 0) {
          const contentNode = frame.children[0];
          figma.currentPage.selection = [contentNode];
          // Brief pause to allow selection change to register before deletion
          await new Promise(resolve => setTimeout(resolve, 100));
      } else {
          console.log("Playground frame was empty, nothing to select for copying.");
      }
      // --- End Select content ---

      frame.remove();
      frameRemoved = true; // Mark frame as removed
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
     // Only show removal message if the frame was actually removed in this action
     if (frameRemoved) {
        figma.notify("Playground frame removed.");
     } else {
        // If frame wasn't found or already removed, don't show the message
        console.log("Playground frame was already gone or not found.");
     }
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

const CURRENT_PLUGIN_VERSION = "1.0.6"; // <-- Make sure this is correct
const UPDATE_CHECK_URL = "https://raw.githubusercontent.com/moelle89/GG_figma_docs/refs/heads/main/_figma_plugin/plugin-updates/latest_version.json"; // <-- Use your actual URL

async function checkForUpdates() {
  console.log(`Current plugin version: ${CURRENT_PLUGIN_VERSION}`);
  try {
    const response = await fetch(UPDATE_CHECK_URL, { cache: "no-store" }); // Prevent caching
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const latestInfo = await response.json();
    console.log(`Latest version available: ${latestInfo.latestVersion}`);

    if (isNewerVersion(latestInfo.latestVersion, CURRENT_PLUGIN_VERSION)) {
      console.log("Update found, attempting to fetch files...");

      // Check if essential file URLs are present for showing the banner
      if (!latestInfo.files || !latestInfo.files.codeJsUrl || !latestInfo.files.uiHtmlUrl) {
         console.error("Update information is missing essential file URLs (code.js, ui.html). Cannot show banner.");
         figma.notify(`Update v${latestInfo.latestVersion} available, but essential file info is missing. Check update server config.`);
         return;
      }

      try {
        // Fetch only code.js and ui.html
        const [codeJsRes, uiHtmlRes] = await Promise.all([
          fetch(latestInfo.files.codeJsUrl, { cache: "no-store" }),
          fetch(latestInfo.files.uiHtmlUrl, { cache: "no-store" })
        ]);

        // Check if all fetches were successful
        if (!codeJsRes.ok || !uiHtmlRes.ok) {
           throw new Error("Failed to download one or more update files.");
        }

        // Get text content
        const codeJsContent = await codeJsRes.text();
        const uiHtmlContent = await uiHtmlRes.text();

        // Prepare the message data
        const updateMessageData = {
          type: 'update-available',
          version: latestInfo.latestVersion,
          notes: latestInfo.releaseNotes || "No release notes provided.",
          files: {
            codeJs: codeJsContent,
            uiHtml: uiHtmlContent
          }
        };

        // Send file content and version info to UI *only if UI is ready*
        if (isUiReady) {
          console.log("UI is ready, sending update message directly.");
          figma.ui.postMessage(updateMessageData);
        } else {
          console.log("UI not ready yet, storing update message.");
          pendingUpdateMessage = updateMessageData; // Store for later
        }

         // Also show a standard notification
         figma.notify(`Plugin Update Available: v${latestInfo.latestVersion}. Click the banner in the plugin to download.`, { timeout: 10000 });


      } catch (fetchError) {
         console.error("Error fetching update files:", fetchError);
         figma.notify(`Update v${latestInfo.latestVersion} available, but failed to download files. Please try again later.`, { error: true });
      }

    } else {
      console.log("Plugin is up to date.");
      // Optionally notify the user they are up-to-date if triggered manually
      // figma.notify("Your plugin is up to date.", { timeout: 3000 });
    }

  } catch (error) {
    console.error("Error checking for updates:", error);
    // Don't show error notification on automatic checks to avoid annoyance
    // figma.notify("Could not check for updates.", { error: true });
  }
}

// --- Helper for basic version comparison (keep this function) ---
// Returns true if versionA is newer than versionB
function isNewerVersion(versionA, versionB) {
    // ... (keep existing implementation)
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const partA = partsA[i] || 0;
        const partB = partsB[i] || 0;
        if (partA > partB) return true;
        if (partA < partB) return false;
    }
    return false; // Versions are equal
}

// --- Trigger the check when the plugin starts ---
// You might want to add a delay or trigger it differently
setTimeout(checkForUpdates, 2000); // Check 2 seconds after plugin starts

// --- Add navigateToCategory function ---
async function navigateToCategory(categoryName) {
  try {
    // Ensure navigation sections are prefetched
    if (!cache.navigationSections) {
      await prefetchNavigationSections();
    }

    await figma.loadAllPagesAsync(); // Ensure pages are loaded

    // Find the COMPONENTS page
    const componentsPage = figma.root.children.find(page => page.name === "COMPONENTS");
    if (!componentsPage) {
      figma.notify("Error: 'COMPONENTS' page not found.", { error: true });
      return;
    }

    // Switch to the COMPONENTS page if not already current
    if (figma.currentPage.id !== componentsPage.id) {
      await figma.setCurrentPageAsync(componentsPage);
      // Add a small delay to allow the page switch to settle
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Helper function for flexible name matching
    const normalizeName = (str) => {
      return str.toLowerCase()
                .replace(/-/g, ' ') // Replace hyphens with spaces
                .replace(/\s+/g, ' ') // Collapse multiple spaces
                .trim();
    };

    const normalizedCategoryName = normalizeName(categoryName);

    // Use the prefetched cache instead of searching every time
    let targetNode = null;
    if (cache.navigationSections && cache.navigationSections.has(normalizedCategoryName)) {
      targetNode = cache.navigationSections.get(normalizedCategoryName);
      // Verify the node still exists and hasn't been removed
      if (targetNode.removed) {
        console.log(`Node for '${categoryName}' was removed, refreshing cache...`);
        cache.navigationSections = null;
        await prefetchNavigationSections();
        // Try again with fresh cache
        targetNode = cache.navigationSections && cache.navigationSections.has(normalizedCategoryName)
          ? cache.navigationSections.get(normalizedCategoryName)
          : null;
      }
    }

    // Fallback to the old search method if not found in cache
    if (!targetNode) {
      console.log(`Category '${categoryName}' not found in cache, falling back to search`);
      targetNode = figma.currentPage.findOne(node => {
        if ((node.type === "FRAME" || node.type === "SECTION") && node.name.startsWith('↪ ')) {
          const baseNodeName = node.name.substring(2); // Get name without prefix
          const normalizedNodeName = normalizeName(baseNodeName);

          // Check for exact match or match without trailing 's' on node name
          return normalizedNodeName === normalizedCategoryName ||
                 normalizedNodeName === normalizedCategoryName + 's' ||
                 normalizedCategoryName === normalizedNodeName + 's';
        }
        return false;
      });
    }

    if (targetNode) {
      figma.viewport.scrollAndZoomIntoView([targetNode]);
      figma.notify(`Navigated to '${categoryName}'.`);
    } else {
      figma.notify(`Warning: Could not find a section for '${categoryName}'.`, { timeout: 4500 });
    }
  } catch (error) {
    console.error(`Error navigating to category '${categoryName}':`, error);
    figma.notify(`Error navigating: ${error.message}`, { error: true });
  }
}

// Function to prefetch all navigation sections
async function prefetchNavigationSections() {
  try {
    // Check if we already have the cache
    if (cache.navigationSections) {
      return;
    }

    console.log("Prefetching navigation sections...");
    await figma.loadAllPagesAsync();

    // Find the COMPONENTS page
    const componentsPage = figma.root.children.find(page => page.name === "COMPONENTS");
    if (!componentsPage) {
      console.warn("No COMPONENTS page found for prefetching navigation sections");
      return;
    }

    // Helper function for normalizing names for matching
    const normalizeName = (str) => {
      return str.toLowerCase()
                .replace(/-/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
    };

    // Find all section/frame nodes with the navigation prefix
    const navigationNodes = componentsPage.findAll(node =>
      (node.type === "FRAME" || node.type === "SECTION") && node.name.startsWith('↪ ')
    );

    // Create a map for quick lookup
    const sectionMap = new Map();

    navigationNodes.forEach(node => {
      const baseNodeName = node.name.substring(2); // Remove the '↪ ' prefix
      const normalizedName = normalizeName(baseNodeName);

      // Store with multiple key variations for flexible matching
      sectionMap.set(normalizedName, node);

      // Store singular/plural variations
      if (normalizedName.endsWith('s')) {
        sectionMap.set(normalizedName.slice(0, -1), node); // Store singular form
      } else {
        sectionMap.set(normalizedName + 's', node); // Store plural form
      }
    });

    cache.navigationSections = sectionMap;
    console.log(`Prefetched ${navigationNodes.length} navigation sections`);

  } catch (error) {
    console.error("Error prefetching navigation sections:", error);
  }
}
// --- End navigateToCategory function ---

// --- Add new function to create section with header --- START ---
async function createSectionWithHeader(sectionName) {
  // Define selection and bounds here
  let selection = null;
  let selectionBounds = null; // Declare selectionBounds here

  try {
    selection = figma.currentPage.selection; // Assign selection inside try
    if (selection.length === 0) {
      figma.notify("Please select the content you want to wrap in a section.", { error: true });
      return;
    }

    // --- Get Selection Bounds and Node(s) ---
    if (selection.length === 1) {
      selectionBounds = {
        x: selection[0].x,
        y: selection[0].y,
        width: selection[0].width,
        height: selection[0].height
      };
    } else {
      // If multiple items are selected, group them temporarily to get bounds
      const group = figma.group(selection, figma.currentPage);
      if (!group) {
          figma.notify("Could not group selected items.", { error: true });
          return;
      }
      // Calculate selectionBounds for group
      selectionBounds = {
          x: group.x,
          y: group.y,
          width: group.width,
          height: group.height
      };

      // Ungroup immediately after getting bounds
      figma.ungroup(group);
    }

    // --- Find Header Component ---
    await figma.loadAllPagesAsync();
    const styleguidePage = figma.root.children.find(page => page.name === "STYLEGUIDE");
    if (!styleguidePage) {
      throw new Error("'STYLEGUIDE' page not found.");
    }
    await figma.loadFontAsync({ family: "Inter", style: "Regular" }); // Ensure fonts are loaded

    const headerComponentSet = styleguidePage.findOne(node =>
      node.type === "COMPONENT_SET" && node.name === "Header"
    );
    if (!headerComponentSet) {
      throw new Error("'Header' Component Set not found on 'STYLEGUIDE' page.");
    }

    // Find the LOGO ICON variant instead of using the default variant
    let headerVariant = headerComponentSet.children.find(variant =>
      variant.name.includes("LOGO ICON")
    );

    // Fallback to default variant if LOGO ICON variant not found
    if (!headerVariant) {
      console.warn("LOGO ICON variant not found, falling back to default variant");
      headerVariant = headerComponentSet.defaultVariant;
    }

    if (!headerVariant) {
      throw new Error("Could not find header variant.");
    }

    // --- Create Header Instance ---
    const headerInstance = headerVariant.createInstance();
    if (!headerInstance) {
        throw new Error("Failed to create instance of Header variant.");
    }

    // Set the header's text component property to the section name
    if (headerInstance.componentProperties) {
      // Find the "Main" text property - it might have a suffix like "#xxxx"
      const mainTextProp = Object.keys(headerInstance.componentProperties).find(
        key => key.startsWith("Main") && headerInstance.componentProperties[key].type === "TEXT"
      );

      if (mainTextProp && typeof headerInstance.setProperties === 'function') {
        // Set the header text to the section name
        const propertyUpdate = {};
        propertyUpdate[mainTextProp] = sectionName;
        headerInstance.setProperties(propertyUpdate);
        console.log("Set header text to section name:", sectionName);
      }
    }

    // --- Calculate Dimensions ---
    // Use selectionBounds variable
    const contentWidth = selectionBounds.width;
    const contentHeight = selectionBounds.height;
    const headerHeight = headerInstance.height; // Get actual height after instance creation
    const horizontalMargin = 100;
    const bottomMargin = 100;
    const spaceBelowHeader = 70;

    const sectionWidth = contentWidth + (2 * horizontalMargin);
    const sectionHeight = headerHeight + spaceBelowHeader + contentHeight + bottomMargin;

    // --- Create and Configure Section ---
    const section = figma.createFrame();
    section.name = "Section: " + sectionName;
    section.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; // White fill
    section.resize(sectionWidth, sectionHeight);

    // --- Position Header ---
    headerInstance.x = 0;
    headerInstance.y = 0;
    // Make sure the header spans the full width
    if (headerInstance && typeof headerInstance.resize === 'function') {
      headerInstance.resize(sectionWidth, headerInstance.height);
    } else {
      console.warn('Header instance does not have resize method. Header width might not match section width.');
    }

    // Check if appendChild is available
    if (typeof section.appendChild !== 'function') {
      throw new Error("The created section doesn't support appendChild. Try using a frame instead.");
    }

    section.appendChild(headerInstance); // Append header first

    // --- Position Cloned Content ---
    // Iterate through original selection and clone/position each node
    let clonedNodes = []; // Keep track of cloned nodes for potential selection
    for (const originalNode of selection) {
        if (!originalNode || typeof originalNode.clone !== 'function') {
            console.warn(`Skipping uncloneable node: ${originalNode ? originalNode.id : 'undefined'} (${originalNode ? originalNode.type : 'undefined'})`);
            continue;
        }
        const clonedNode = originalNode.clone();
        if (!clonedNode) {
            console.warn(`Failed to clone node: ${originalNode.id}`);
            continue;
        }

        // Calculate position relative to the section origin
        // Original node's top-left corner relative to the overall selection bounds top-left
        const relativeX = originalNode.x - selectionBounds.x;
        const relativeY = originalNode.y - selectionBounds.y;

        // Position inside the section, offset by margins and header height
        clonedNode.x = horizontalMargin + relativeX;
        clonedNode.y = headerHeight + spaceBelowHeader + relativeY;

        // Add check for appendChild function (should already be checked earlier, but being thorough)
        if (typeof section.appendChild !== 'function') {
          console.warn("Skipping appendChild for cloned node - section doesn't support this method");
          continue;
        }

        section.appendChild(clonedNode);
        clonedNodes.push(clonedNode); // Add to list
    }

    // --- Position Section on Canvas ---
    // Place it below the original content for now
    section.x = selectionBounds.x;
    section.y = selectionBounds.y + selectionBounds.height + 100;

    // --- Final Steps ---
    figma.currentPage.appendChild(section);

    // Visually stylize the frame as a section
    section.strokeWeight = 1;
    section.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    section.cornerRadius = 8;

    // Add metadata to mark this as a section (won't actually convert it)
    if (typeof section.setPluginData === 'function') {
      section.setPluginData('isSection', 'true');
    }

    // Select and show the section
    figma.viewport.scrollAndZoomIntoView([section]);
    figma.currentPage.selection = clonedNodes.length > 0 ? clonedNodes : [section]; // Select cloned nodes if any, else the section
    figma.notify(`Section '${sectionName}' created successfully.`);

  } catch (error) {
    console.error("Error creating section with header:", error);
    figma.notify(`Error: ${error.message}`, { error: true });
  }
}
// --- Add new function to create section with header --- END ---

// Function to show dialog for section name input
function showSectionNameDialog() {
  // Check if content is selected first
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("Please select the content you want to wrap in a section.", { error: true });
    return;
  }

  // Send message to UI to show dialog
  figma.ui.postMessage({
    type: 'show-section-name-dialog'
  });
}