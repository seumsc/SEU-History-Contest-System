i=1
n=3

echo ($i/$n)Restoring Git submodules...
if [ ! -d '.git' ]; git init; fi;
git submodule init
git submodule update
((i++))

# echo ($i/$n)Restoring Client-side NPM Packages...
# cd ./HistoryContest.Client
# npm install
# ((i++))

# echo ($i/$n)Building Webpack...
# node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js --env.prod
# node node_modules/webpack/bin/webpack.js --env.prod
# ((i++))

# cd ../

echo ($i/$n)Restoring Server-side Nuget Packages...
dotnet restore "./HistoryContest.sln"
((i++))

echo ($i/$n)Building Server...
cd ./HistoryContest.Server
dotnet build -c Debug  
::msbuild ./HistoryContest.sln /property:Configuration=Debug /verbosity:minimal
((i++))

echo ($i/$n)Restoring MDWiki renderer html...
cd ./HistoryContest.Docs/Wiki
if [ ! -f 'index.html' ]; then wget http://dynalon.github.io/mdwiki/index.html; fi
echo Successfully downloaded index.html from http://dynalon.github.io/mdwiki/index.html.
((i++))

echo Build process finished.
pause