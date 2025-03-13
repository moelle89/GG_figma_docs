import json

# Read data from file
with open("updated_data.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Convert dictionary to a formatted JSON string with each entry on a new line
formatted_data = json.dumps(data, indent=None, separators=(",\n", ": "))

# Save to a new file
with open("formatted_data.json", "w", encoding="utf-8") as file:
    file.write(formatted_data)

# Print output
print(formatted_data)