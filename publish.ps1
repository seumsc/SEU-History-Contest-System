if (Test-Path ./HistoryContest.Site) {
    Remove-Item -Recurse .\HistoryContest.Site\*
} else {
    mkdir HistoryContest.Site  
}    
    
# if (!(Test-Path .git)) { git init; }
# git submodule init
# git submodule update

Set-Location ./HistoryContest.Server
dotnet restore

dotnet publish --output "../HistoryContest.Site" --configuration Release

Set-Location ../HistoryContest.Site
Write-Output "dotnet HistoryContest.Server.dll -rb -env production" >> run_app.ps1