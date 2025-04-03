figma.showUI(`<script>
window.onmessage = (event) => {
  const data = event.data.pluginMessage;
  if (data && data.components) {
    const list = document.getElementById('component-list');
    const searchInput = document.getElementById('search-input');
    const components = data.components;

    function filterAndRenderComponents(searchTerm = '') {
      list.innerHTML = '';
      const filteredComponents = components.filter(component =>
        component.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredComponents.length === 0) {
        list.innerHTML = '<li style="color: #666; font-style: italic;">No components found</li>';
        return;
      }

      filteredComponents.forEach(component => {
        const item = document.createElement('li');
        item.className = 'component-item';

        // Create container for component name and actions
        const content = document.createElement('div');
        content.className = 'component-content';

        // Component name (now clickable)
        const name = document.createElement('span');
        name.textContent = component.name.replace('❖ ', '');
        name.className = 'component-name';
        name.style.cursor = 'pointer';
        name.onclick = () => {
          parent.postMessage({ pluginMessage: { type: 'create-instance', id: component.id } }, '*');
        };
        content.appendChild(name);

        // Actions container
        const actions = document.createElement('div');
        actions.className = 'component-actions';

        // Go to component button
        const gotoBtn = document.createElement('button');
        gotoBtn.innerHTML = '→';
        gotoBtn.title = 'Go to Component';
        gotoBtn.className = 'action-button';
        gotoBtn.onclick = (e) => {
          e.stopPropagation();
          parent.postMessage({ pluginMessage: { type: 'goto-component', id: component.id } }, '*');
        };

        actions.appendChild(gotoBtn);
        content.appendChild(actions);
        item.appendChild(content);
        list.appendChild(item);
      });
    }

    // Initial render
    filterAndRenderComponents();

    // Add search functionality
    searchInput.addEventListener('input', (e) => {
      filterAndRenderComponents(e.target.value);
    });
  }
};
</script>
<style>
  body {
    font-family: "Inter", sans-serif;
    padding: 16px;
    margin: 0;
    height: 100vh;
    box-sizing: border-box;
    color: var(--figma-color-text);
    background-color: var(--figma-color-bg);
  }
  h2 {
    margin-top: 0;
    color: var(--figma-color-text);
  }
  .search-container {
    position: sticky;
    top: 0;
    background: var(--figma-color-bg);
    padding: 8px 0;
    margin-bottom: 8px;
  }
#search-input {
    width: 100%;
    padding: 14px;
    border: 2px solid var(--figma-color-border);
    border-radius: 10px;
    font-size: 14px;
    box-sizing: border-box;
    background: var(--figma-color-bg);
    color: var(--figma-color-text);
}
  #search-input::placeholder {
    color: var(--figma-color-text-tertiary);
  }

  #component-list {
    list-style: none;
    padding: 0;
    margin-top: 0;
    height: 500px;
    display: inline-table;
  }

    /* Style the scrollbar for webkit browsers (Chrome, Safari, etc.) */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: var(--figma-color-bg);
    }

    &::-webkit-scrollbar-thumb {
      background: var(--figma-color-border);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--figma-color-text-tertiary);
    }

    /* Hide scrollbar for Firefox */
    scrollbar-width: thin;
    scrollbar-color: var(--figma-color-border) transparent;
  }

  .component-item {
    margin: 4px 0;
    width: 85vw;
  }
    .component-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        border-radius: 4px;
        width: 260px;
        transition: background-color 0.2s;
    }
  .component-content:hover {
    background-color: var(--figma-color-bg-hover);
  }
.component-name {
    flex-grow: 1;
    font-size: .9rem;
    font-weight: 600;
}
  .component-actions {
    display: flex;
    gap: 8px;
  }
  .action-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
    color: var(--figma-color-text-secondary);
  }
  .action-button:hover {
    background-color: var(--figma-color-bg-hover);
    color: var(--figma-color-text);
  }
  .component-name:hover {
    color: var(--figma-color-text-brand);
  }
  /* Style for the "No components found" message */
  .component-item li {
    color: var(--figma-color-text-tertiary);
    font-style: italic;
  }
</style>
<h4>GetGenius.AI Component Library</h4>
<div class="search-container">
  <input type="text" id="search-input" placeholder="Search components...">
</div>
<ul id="component-list"></ul>
`, {
    width: 320,
    height: 700,
    themeColors: true
});

async function findComponents() {
    try {
        await figma.loadAllPagesAsync();

        const componentsPage = figma.root.children.find(page => page.name === "COMPONENTS");
        if (!componentsPage) {
            figma.ui.postMessage({ components: [] });
            return;
        }
        // First, ensure the page is fully loaded
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });

        const components = componentsPage.findAll(node =>
            (node.type === "COMPONENT" || node.type === "COMPONENT_SET") && node.name.startsWith("❖ ")
        );

        figma.ui.postMessage({
            components: components.map(component => ({
                id: component.id,
                name: component.name
            }))
        });
    } catch (error) {
        figma.ui.postMessage({ error: error.message })
    }
}

async function createInstance() {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    const allNodes = figma.currentPage.findAll(node => node.type === "COMPONENT" || node.type === "COMPONENT_SET");

    if (allNodes.length === 0) {
        figma.ui.postMessage({
            components: [],
            error: "No components found. Please add components to the current page."
        });
        return;
    }
    // Filter for components with the specific prefix
    const components = allNodes.filter(node => node.name.startsWith("❖"));

    if (components.length === 0) {
        figma.ui.postMessage({
            components: [],
            error: "No components found. Please add components starting with '❖ ' to the COMPONENTS page."
        });
        return;
    }

    // Add console log to debug
    console.log(`Found ${components.length} components`);

    figma.ui.postMessage({
        components: components.map(component => ({
            id: component.id,
            name: component.name
        }))
    });
}

findComponents();

figma.ui.onmessage = async msg => {
    if (msg.type === "close") {
        figma.closePlugin();
    } else if (msg.type === "create-instance") {
        try {
            const node = await figma.getNodeByIdAsync(msg.id);
            let component;

            if (node.type === "COMPONENT_SET") {
                component = node.defaultVariant;
            } else if (node.type === "COMPONENT") {
                component = node;
            } else {
                figma.notify("Error: Invalid component type", { error: true });
                return;
            }

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
    } else if (msg.type === "goto-component") {
        try {
            const node = await figma.getNodeByIdAsync(msg.id);
            if (node) {
                // Use setCurrentPageAsync instead of directly setting currentPage
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
