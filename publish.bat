@echo off
call dotnet restore "./HistoryContest.sln"
call dotnet publish "./HistoryContest.Server/HistoryContest.Server.csproj" --output "./HistoryContest.Site" --configuration Release
cd ./HistoryContest.Site
echo @echo off > run_app.bat
echo call dotnet HistoryContest.Server.dll -rb -env Production >> run_app.bat
call run_app.bat