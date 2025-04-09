# Menu Data Synchronization

This feature allows you to keep the component categories and items in the Figma plugin in sync with the `menu.json` file in your project. This enables you to:

1. Make changes to component categories and items in one place (`menu.json`)
2. Keep the Figma plugin and the documentation website in sync
3. Update the plugin's menu structure without modifying code directly

## Files and their roles

- `data/menu.json`: The source of truth for component categories and items
- `_figma_plugin/code.js`: Contains the menu structure for the Figma plugin (automatically updated from menu.json)
- `scripts/updateComponents.js`: Updates both component data files and the Figma plugin menu structure based on `menu.json`

## How it works

The system uses a simple but effective approach:

1. All component categories and items are defined in `data/menu.json`
2. When you run `scripts/updateComponents.js`, it:
   - Updates the components.json file with any new items from menu.json
   - Updates the defaultMenuData array in the Figma plugin's code.js file
3. The next time the Figma plugin runs, it uses the updated menu structure

## How to use

### Initial setup

If you're starting a new project:

1. Create or edit `data/menu.json` with your initial component categories and items
2. Run `node scripts/updateComponents.js` to populate both components.json and the Figma plugin code

### Adding or updating components

1. Edit `data/menu.json` to add/modify categories and items
2. Run `node scripts/updateComponents.js` to update everything
3. Reload the Figma plugin to see your changes

## Example workflow

### Adding a new component category

1. Edit `data/menu.json` to add a new category:
   ```json
   [
     // existing categories...
     { "category": "My New Category", "items": ["New Component 1", "New Component 2"] }
   ]
   ```

2. Run the update script:
   ```bash
   node scripts/updateComponents.js
   ```

3. The script will:
   - Update the Figma plugin code with the new category
   - Add the new components to components.json
   - Show log messages about what was updated

4. Reload your Figma plugin to see the new category and components

## Troubleshooting

- **No changes visible in plugin**: Make sure you've reloaded/reopened the plugin after running the update script
- **Script errors**: Check for valid JSON syntax in menu.json
- **Components not showing up**: Ensure your component names in menu.json exactly match the component names in Figma (minus the ❖ prefix)

## Best practices

1. Always edit `menu.json` directly and run the update script afterwards
2. Commit both `menu.json` and any updated files together
3. Run the update script after pulling changes from other developers to keep everything in sync 