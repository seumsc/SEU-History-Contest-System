#  东南大学·校史知识竞赛答题系统

### License

**[No License](https://choosealicense.com/no-license/)**

### 网站目录结构

| Route | Description   |
| ----- | ------------- |
| /     | 主页面，登录页入口。 |
| /api  | 后端API文档入口。  |
| /wiki | Wiki文档入口。     |
| /defense | 前端答辩网页入口。  |

网站地址：https://history-contest.chinacloudsites.cn (Unavailable now)

### 配置/构建流程

> **目前，项目暂时关闭了所有与NPM及Webpack有关的自动配置操作。若有需要，请运行`HistoryContest.Client`文件夹中的`webpack_build.bat`进行生成。**

1. 获取项目到本地（Clone/Download）。

2. 若想配置开发环境，可运行`build`脚本, ~~安装前端（NPM）~~，后端（Nuget）的各种包依赖并生成项目。
  
    为此，需要准备好下列环境：
    - [.Net Core 2.0 SDK](https://www.microsoft.com/net/download/core)
    - [Git](https://git-scm.com/downloads)

    并保证环境变量中设置了`git`,`dotnet`的相关PATH。

3. 若想直接构建成品，可运行`publish`脚本，发布完整程序到`HistoryContest.Site`文件夹中。
  
    需要注意的是，发布出来的成品将在Production环境下运行。
  
    而在这个环境中,你需要为`Sql Server`与`Redis`各准备一个**Connection String**来连接数据库（见[HistoryContest.Server/appsettings.json](https://github.com/SEU-BugFourchive/HistoryContest.Server/blob/master/appsettings.json)）。
    
    如果没有远程的数据库的话，也可将Development中的内容复制到Production中，这样需要在本地准备好：
    - [Sql Server LocalDB](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-2016-express-localdb)
    - [Redis Server](https://redis.io/download)/[Redis on Windows](https://github.com/MicrosoftArchive/redis/releases)

    此后，可以运行文件夹里的`run_app`脚本来运行程序。

    > 更直接的方法是在命令行中使用dotnet dll:
    > dotnet HistoryContest.Server.dll -- <参数>
    > 如：dotnet HistoryContest.Server.dll -- --help => 查看所有可用命令

4. 对于Wiki：所有Wiki内容都通过`HistoryContest.Docs/wiki`文件夹里的.md文件，经主目录下的`index.html`渲染生成。

5. 网站服务器使用Azure。服务器使用了自动化部署，与此Github仓库相关联。每当此仓库有新版本时，服务器将自动将更新抓取重新部署。

### 使用组件

* 后端
  1. [ASP.NET Core 2.0](https://docs.microsoft.com/en-us/aspnet/core/tutorials/)
  2. [Entity Framework Core](https://docs.microsoft.com/zh-cn/ef/core/)
  3. [.NET Core SPA Services](https://blogs.msdn.microsoft.com/webdev/2017/02/14/building-single-page-applications-on-asp-net-core-with-javascriptservices/)
* 前端
  - Original Version
    1. [Ethereal by HTML5 UP](https://html5up.net/ethereal)（答题页）
    2. [light-bootstrap-dashboard-v1.1](http://demos.creative-tim.com/light-bootstrap-dashboard)（后台页）
  - Vue Version
    1. [TypeScript](https://www.tslang.cn/docs/home.html)
    2. [Webpack](http://www.jianshu.com/p/42e11515c10f)
    3. [Vue.js](https://cn.vuejs.org/v2/guide/)
* 文档
  1. [Swagger](https://docs.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger)
  2. [MDWiki](http://dynalon.github.io/mdwiki/#!quickstart.md)

### Future Horizons

[Repository Projects](https://github.com/SEU-BugFourchive/SEU-History-Contest-System/projects)
