import json

# Load data from JSON file
with open("data.json", "r") as file:
    data = json.load(file)

# Filter out keys containing "-outline" or "-sharp"
filtered_data = {key: value for key, value in data.items() if "-outline" not in key and "-sharp" not in key}

# Duplicate entries with "-outline" and "-sharp"
duplicated_data = {}
for key, value in filtered_data.items():
    duplicated_data[key] = value
    duplicated_data[f"{key}-outline"] = value
    duplicated_data[f"{key}-sharp"] = value

# Remove entries that start with "logo" and have "-outline" or "-sharp"
cleaned_data = {key: value for key, value in duplicated_data.items() if not (key.startswith("logo") and ("-outline" in key or "-sharp" in key))}

# Save the updated data back to the JSON file
with open("updated_data.json", "w") as file:
    json.dump(cleaned_data, file, indent=4)

print("Updated data saved to updated_data.json")
