@echo off
setlocal enabledelayedexpansion

set "input_file=combined.json"
set "output_file=cleaned_combined.json"

(for /f "delims=" %%A in (%input_file%) do (
    set "line=%%A"
    if not "!line!"=="!line:~0,2!" (
        echo !line! | findstr /V /R "^//" >> %output_file%
    ) else (
        echo !line!>> %output_file%
    )
)) 

echo Processed file saved as %output_file%
