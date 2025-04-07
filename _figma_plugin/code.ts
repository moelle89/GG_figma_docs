// Add drop event handler
figma.on('drop', async (event: DropEvent) => {
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