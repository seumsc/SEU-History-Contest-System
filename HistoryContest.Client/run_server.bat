@echo off
cd ../
echo Building Server Application...
echo.
msbuild ./HistoryContest.sln /property:Configuration=Debug /verbosity:minimal
echo.
echo Running Server Application...
echo.
cd ./HistoryContest.Server/
dotnet run --configuration Debug -- /runbrowser
pause