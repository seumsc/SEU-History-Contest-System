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

cd ../

echo.
echo Restoring MDWiki renderer html...
cd ./HistoryContest.Wiki
call powershell (new-object System.Net.WebClient).DownloadFile('http://dynalon.github.io/mdwiki/index.html', './index.html')
echo Successfully downloaded index.html from http://dynalon.github.io/mdwiki/index.html.

echo.
echo Restore process finished.
pause