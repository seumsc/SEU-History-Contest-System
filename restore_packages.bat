@echo off
::"echo." is for printting an empty line, "::" for comment.

echo Restoring Server-side Nuget Packages...
cd ./HistoryContest.Server
call dotnet restore

cd ../

echo. 
echo Restoring Client-side NPM Packages...
cd ./HistoryContest.Client
call npm install

echo.
echo Restore process finished.
pause
exit