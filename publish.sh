if [ ! -d 'HistoryContest.Site' ]
    rm -rf ./HistoryContest.Site
else
    mkdir HistoryContest.Site
fi

if [ ! -d '.git' ]; git init; fi;
git submodule init
git submodule update

cd ./HistoryContest.Server
dotnet restore
dotnet publish --output "../HistoryContest.Site" --configuration Release

cd ../HistoryContest.Site
echo dotnet HistoryContest.Server.dll -rb -env production >> run_app.sh