@echo off
setlocal enabledelayedexpansion

rem Get the directory of the script
set "directory=%~dp0"

rem Change to the specified directory
cd /d "%directory%" || exit /b

rem Loop through all files in the directory
for %%f in (* *) do (
    set "filename=%%f"
    set "newname=!filename: =_!"
    
    rem Convert to lowercase
    set "newname=!newname:~0,1!!newname:~1!"
    for /L %%i in (0,1,25) do (
        set "char=!newname:~%%i,1!"
        if defined char (
            set "lower=!char: =! !lower!"
            for %%j in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
                set "lower=!lower:%%j=%%j!"
            )
            set "newname=!newname:!char!=!lower:~0,1!!lower:~1!"
        )
    )

    if not "!filename!"=="!newname!" (
        ren "%%f" "!newname!"
        echo Renamed "%%f" to "!newname!"
    )
)

endlocal