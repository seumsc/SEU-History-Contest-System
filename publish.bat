@echo off
if exist HistoryContest.Site (
    del /q /s .\HistoryContest.Site\*.* > nul
) else (
    mkdir HistoryContest.Site
)

if not exist .git git init
call git submodule init
call git submodule update

cd ./HistoryContest.Server
call dotnet restore
if %ERRORLEVEL% NEQ 0 pause

call dotnet publish --output "../HistoryContest.Site" --configuration Release
if %ERRORLEVEL% NEQ 0 pause

cd ../HistoryContest.Site
echo @echo off > run_app.bat
echo dotnet HistoryContest.Server.dll -rb -env production >> run_app.bat