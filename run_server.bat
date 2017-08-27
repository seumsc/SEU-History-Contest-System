@echo off
cd ../HistoryContest.Server
echo Building Server Application...
msbuild ../HistoryContest.sln /property:Configuration=Debug /verbosity:minimal
echo.
echo Running Server Application...
set ASPNETCORE_ENVIRONMENT=Development
dotnet run --configuration Debug -- /runbrowser
pause