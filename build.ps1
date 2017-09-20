$i = 1;
$n = 3;

Write-Output "($i/$n)Restoring Git submodules...";
if (!(Test-Path .git)) { git init; }
git submodule init;
git submodule update;
$i++;

# Write-Output "($i/$n)Restoring Client-side NPM Packages...";
# Set-Location ./HistoryContest.Client;
# npm install;
# $i++;

# Write-Output "($i/$n)Building Webpack...";
# node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js --env.prod;
# node node_modules/webpack/bin/webpack.js --env.prod;
# $i++;

# Set-Location ../;

Write-Output "($i/$n)Restoring Server-side Nuget Packages...";
dotnet restore "./HistoryContest.sln";
$i++;

Write-Output "($i/$n)Building Server...";
Set-Location ./HistoryContest.Server;
dotnet build -c Debug;
# msbuild ./HistoryContest.sln /property:Configuration=Debug /verbosity:minimal;
$i++;

# Write-Output "($i/$n)Restoring MDWiki renderer html...";
# Set-Location ./HistoryContest.Docs/Wiki;
# if (!(Test-Path .index.html)) { 
#     Invoke-WebRequest -Uri 'http://dynalon.github.io/mdwiki/index.html' -OutFile './index.html'; 
#     Unblock-File './index.html';
# }
# Write-Output "Successfully downloaded index.html from http://dynalon.github.io/mdwiki/index.html.";
# $i++;

Write-Output "Build process finished".
Pause;