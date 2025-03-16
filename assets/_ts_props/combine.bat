:: Configuration
set "inputDir=src"
set "outputFile=dist\combined.json"

:: Ensure output directory exists
if not exist "dist" mkdir "dist"

:: Clear the output file
echo. > "%outputFile%"

:: Loop through all .ts files and append their contents
for /r "%inputDir%" %%F in (*.ts) do (
    echo // File: %%F >> "%outputFile%"
    type "%%F" >> "%outputFile%"
    echo. >> "%outputFile%"
)

echo Combined TypeScript files into %outputFile%

can you add that it will remove every line that starts with "// File" and replaces "export interface " with ""