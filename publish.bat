@echo off
if exist HistoryContest.Site (
    del /q /s .\HistoryContest.Site\*.* > nul
) else (
    mkdir HistoryContest.Site
)

cd ./HistoryContest.Server
call dotnet restore
if %ERRORLEVEL% NEQ 0 exit
call dotnet publish --output "../HistoryContest.Site" --configuration Release
if %ERRORLEVEL% NEQ 0 exit

cd ../HistoryContest.Site
echo @echo off > run_app.bat
echo call dotnet HistoryContest.Server.dll -rb -env Production >> run_app.bat
call run_app.bat