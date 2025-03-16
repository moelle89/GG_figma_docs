import re

# Read the file
with open("combined.json", "r", encoding="utf-8") as file:
    lines = file.readlines()

# Process the content
cleaned_lines = [re.sub(r"^//.*", "", line).replace("export interface ", "") for line in lines]
cleaned_content = "".join(cleaned_lines)

# Split datasets based on block structure
blocks = re.split(r'\n\n+', cleaned_content.strip())  # Split datasets by double newlines
formatted_blocks = [block.strip() + "," for block in blocks]  # Add comma at the end of each block
wrapped_content = "{\n" + "\n\n".join(formatted_blocks).rstrip(',') + "\n}"  # Wrap in {}

# Write to a new file
with open("props.json", "w", encoding="utf-8") as file:
    file.write(wrapped_content)

print("Processed file saved as props.json")