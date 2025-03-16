import json

def update_image_paths(json_file):
    # Load the JSON file
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Recursive function to update "imagePath1"
    def update_paths(obj):
        if isinstance(obj, dict):
            if "imagePath1" in obj:
                obj["imagePath1"] = "assets/prop_table/empty.png"
            for key in obj:
                update_paths(obj[key])
        elif isinstance(obj, list):
            for item in obj:
                update_paths(item)

    # Apply the function to the data
    update_paths(data)

    # Save the modified JSON back
    with open(json_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)

# Example usage
if __name__ == "__main__":
    json_filename = "components.json"  # Change this to your actual file name
    update_image_paths(json_filename)
    print(f"Updated {json_filename} successfully!")
