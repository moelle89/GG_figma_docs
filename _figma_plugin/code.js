figma.showUI(__html__, {
  width: 320,
  height: 700,
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

// Function to load components from the current file
async function loadComponentsFromCurrentFile() {
  // Return cached results if available
  if (cache.components) {
    figma.ui.postMessage({
      status: `Found ${cache.components.length} components in the current file.`,
      components: cache.components
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

    // Get thumbnails for each component
    const formattedComponents = await Promise.all(components.map(async component => {
      const thumbnail = await component.createThumbnailAsync();
      return {
        id: component.id,
        name: component.name,
        thumbnail: thumbnail ? thumbnail.toString('base64') : null
      };
    }));

    // Store in cache
    cache.components = formattedComponents;

    figma.ui.postMessage({
      status: `Found ${components.length} components in the current file.`,
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
  // Return cached results if available
  if (cache.icons) {
    figma.ui.postMessage({
      iconsStatus: `Found ${cache.icons.length} icons in the app-icons section.`,
      icons: cache.icons
    });
    return;
  }

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

    // Find components with the "app-icons" parent
    const components = componentsPage.findAll(node =>
      (node.type === "COMPONENT" || node.type === "COMPONENT_SET") &&
      node.parent && node.parent.name === "icons" // Check if the parent is the "app-icons" section
    );

    if (components.length === 0) {
      figma.ui.postMessage({
        iconsError: "No icon components found in the app-icons section.",
        icons: []
      });
      return;
    }

    const formattedComponents = components.map(component => ({
      id: component.id,
      name: component.name
    }));

    // Store in cache
    cache.icons = formattedComponents;

    figma.ui.postMessage({
      iconsStatus: `Found ${components.length} icons in the app-icons section.`,
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

// Function to reload and refresh the cache
function refreshCache(type) {
  if (type === 'components') {
    cache.components = null;
    loadComponentsFromCurrentFile();
  } else if (type === 'icons') {
    cache.icons = null;
    loadIconComponentsFromCurrentFile();
  } else {
    // Refresh all
    cache.components = null;
    cache.icons = null;
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
      // Load icons when switching to that tab
      loadIconComponentsFromCurrentFile();
    } else if (currentTab === "components-tab") {
      // Load local components when switching to that tab
      loadComponentsFromCurrentFile();
    }
  }
  else if (msg.type === "refresh") {
    // Handle refresh requests
    refreshCache(msg.target);
    figma.notify("Refreshing components...");
  }
  else if (msg.type === "create-instance") {
    try {
      let component;

      // Get the component from the current file
      const node = await figma.getNodeByIdAsync(msg.id);

      if (node.type === "COMPONENT_SET") {
        component = node.defaultVariant;
      } else if (node.type === "COMPONENT") {
        component = node;
      } else {
        figma.notify("Error: Invalid component type", { error: true });
        return;
      }

      // Create instance
      const instance = component.createInstance();
      instance.x = figma.viewport.center.x;
      instance.y = figma.viewport.center.y;
      figma.currentPage.appendChild(instance);
      figma.viewport.scrollAndZoomIntoView([instance]);
      figma.currentPage.selection = [instance];
      figma.notify("Component instance created successfully!");
    } catch (error) {
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