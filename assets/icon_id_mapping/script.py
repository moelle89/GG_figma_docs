import json
import re

# File paths (update these as needed)
icon_names_file = "icon_names.txt"
data_sets_file = "data_sets.txt"

# Read and parse icon names
with open(icon_names_file, "r", encoding="utf-8") as f:
    icon_names_content = f.read()
    icon_names = re.findall(r'"(.*?)"', icon_names_content)  # Extract names from quotes

# Read and clean the data-sets file
with open(data_sets_file, "r", encoding="utf-8") as f:
    data_sets_content = f.read().strip()

# Ensure the content is a valid JSON object
if not data_sets_content.startswith("{"):
    data_sets_content = "{" + data_sets_content
if not data_sets_content.endswith("}"):
    data_sets_content = data_sets_content.rstrip(",") + "}"

# Try to load JSON
try:
    data_sets = json.loads(data_sets_content)
except json.JSONDecodeError as e:
    print("Error parsing JSON:", e)
    exit(1)

# Collect matching entries
matching_entries = {name: data_sets[name] for name in icon_names if name in data_sets}

# Output results
print(json.dumps(matching_entries, indent=4))