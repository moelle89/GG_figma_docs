import re
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
combined_file_path = os.path.join(script_dir, "dist", "combined.json")  # Correct path to combined.json

# Read the file
with open(combined_file_path, "r", encoding="utf-8") as file:
    lines = file.readlines()

# Process the content
cleaned_lines = []
for line in lines:
    line = re.sub(r"^//.*", "", line)  # Remove comment lines
    line = line.replace("export interface ", "")  # Remove specific keywords
    line = re.sub(r"^❖ ", "", line)  # Remove "❖ " prefix if present
    cleaned_lines.append(line)

cleaned_content = "".join(cleaned_lines)

# Split datasets based on block structure
blocks = re.split(r'\n\n+', cleaned_content.strip())  # Split datasets by double newlines
formatted_blocks = [block.strip() + "," for block in blocks]  # Add comma at the end of each block
wrapped_content = "{\n" + "\n\n".join(formatted_blocks).rstrip(',') + "\n}"  # Wrap in {}

# Write to a new file
output_file_path = os.path.join(script_dir, "props.json")  # Output path for props.json
with open(output_file_path, "w", encoding="utf-8") as file:
    file.write(wrapped_content)

print("Processed file saved as props.json")