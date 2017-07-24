# yzh

## 6.22

1. 成功运行C#+vue.js模板->需要解释模板结构
2. 下载mediawiki,尝试搭建wiki文档


## 7.17

* 后端：编写一个WebApi, 提供Http接口给前端使用

  后端采用MVC模式，其中：

  * Models负责将数据库的裸数据封装成一个具体的逻辑实体，并用该逻辑实体进行操作
  * Controllers负责接收/返回http请求，以及与数据库通讯等层与层之间的事物
  * View负责生成页面，用cshtml作模板，最后被解析成一个正常的html并返回

* 依赖注入模式

  ​	通过将类放入一个容器中，用容器来管理对象的实例化与生命周期，从而达到解耦的效果

  ​	参见：https://www.zhihu.com/question/32108444

* C# 委托：对应C/C++的函数指针概念，最常用的例子是作为回调函数使用

  ​	声明一个委托实际上是创建了一个继承自System.Delegate的类，这个委托实例化时，其构造函数接受一个函数指针（函数名/委托）

  如：

  ```
  public delegate void printString(string s);
  ...
  printString ps1 = new printString(WriteToScreen);
  printString ps2 = new printString(WriteToFile);
  ```

* C# 属性：待后日补充

* 想用跟实验室学网络协议时用到的Wireshark来抓包分析，但是由于目前是在localhost上测试，ws只能抓取通过网卡的流量，所以暂时不可行……

* web api 生成文档？

## 7.18

* Visual Studio插件推荐：

  https://blogs.msdn.microsoft.com/webdev/2017/03/21/five-visual-studio-2017-extensions-for-web-developers/

  （另附：VS Code前端类插件推荐：https://zhuanlan.zhihu.com/p/27905838

* Entity Framework:数据访问层设计技术

* （！）C# MVC插件可以自动将C#对象序列化重整为JSON，因此可以直接用作Http请求的返回值。

  * C# MVC也可以在参数中加入[FromBody]属性，使得该参数从Http请求中获取构造对象，赋值给参数



## 7.19

* Web API文档自动生成器：Swagger

  可以通过hostname/swagger来查看，网页源数据在hostname/swagger/{version}/swagger.json里

  可以用///注释来为API添加说明

* 研究了一下迷之复杂的Azure...：

  * 按(Ctrl+)F5在本地(localhost)运行网站程序，而我们可以通过项目右键->发布(Publish)将应用按照Release方式Build，放到本地的一个文件夹，或是直接部署到Azure上。

  * 部署到Azure时，需要一个Azure订阅，一个资源组（用来对云资源分类），一个Plan(指定了机房地区、总配置，可以容纳多个应用在这个配置下运行)

  * 部署完毕后，Azure会自动为我们分配一个网址，代表对应的网络资源，一般是<app名字>.azurewebsites.net/， 我们以后便可基于这个网址来测试服务。

  * 本地对项目更新以后，再次点发布即可更新到Azure上

  * 后续将看一下自动部署的方法。

    ​

## 7.20

* Azure 自动部署(git)步骤:
  1. 在Azure Portal找到自己已经部署好的App, 找到设置栏
  2. 选择设置->部署凭据，设置好用来验证的账户与密码
  3. 选择设置->部署选项->设置源
  4. 此时，有两种选择：
     * git: 会提供一个远程库的URL，将本地与这个远程库关联后，配合账户密码即可上传
     * github:关联一个github页面，适合进行团队开发
  5. 选择好后，对于VS，可在Team Explorer中用按键进行简单操作，也可用git shell直接操作（不知道VS Code是怎么样的）
* GitHub教育用户申请……



## 7.21

* Bundle:资源压缩
* 使用.UseWebRoot()手动更改wwwroot路径
* 信息量太大……但又感觉说不清楚看了什么，等待后面消化。




## 7.22

* 项目结构分离过程（开发时）：
  * 在Program.cs中将ContentRoot设为了"当前目录（Program.cs所在目录)"的上一级目录:

    ```
    .UseContentRoot(Directory.GetParent(Directory.GetCurrentDirectory()).FullName)
    ```

  * 在Startup.cs中设定WebpackDevMiddleWare的ProjectPath为ContentRoot中的`/client`(前端)目录：

    ```
    ProjectPath = env.ContentRootPath + "/client"
    ```

  * 在webpack.config.js中将所有./wwwroot目录设置为../wwwroot

  * index.cshtml中的main.js目录不用改，因为可以用~定位到设定好的wwwroot 

  * 由于webpack的build是通过`application`项目的csproj发布后运行的，所以需要修改.csproj文件来：

    1. 配置正确的运行位置:

       ```
       <Exec Command="webpack_build.bat" WorkingDirectory="../client/" />
       ```

       这里webpack_build.bat是将几个发布命令整合在一起的批处理。前端也可以用这个文件来将前端文件直接正式build。（不过平时开发还是靠middleware自动生成就好了~）

    2. 将生成的文件拷贝到正确的publish目录下：

       ```
             <DistFiles Include="..\wwwroot\**" />
             <ResolvedFileToPublish Include="@(DistFiles->'%(FullPath)')" Exclude="@(ResolvedFileToPublish)">
               <RelativePath>wwwroot/%(RecursiveDir)%(Filename)%(Extension)</RelativePath>
               <CopyToPublishDirectory>PreserveNewest</CopyToPublishDirectory>
             </ResolvedFileToPublish>
       ```

  * 此时，缺少View目录的指定。View目录的修改通过继承`Microsoft.AspNetCore.Mvc.Razor.IViewLocationExpander`实现。[详细见此](https://stackoverflow.com/questions/38810978/adding-a-search-location-in-asp-net-cores-viewengineexpander)：

    ```
    		public void PopulateValues(ViewLocationExpanderContext context)
    		{
    			context.Values["customviewlocation"] = nameof(MyViewEngine);
    		}

    		public IEnumerable<string> ExpandViewLocations(
    			 ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
    		{
    			return new[]
    			{
    			 "~/application/Views/{1}/{0}.cshtml",
    			 "~/application/Views/Shared/{0}.cshtml"
    		};
    		}
    ```

    然后在services中通过mvc函数修改：

    ```
    			services.AddMvc().AddRazorOptions(options=>
    			{
    				options.ViewLocationExpanders.Clear();
    				options.ViewLocationExpanders.Add(new MyViewEngine());
    			});
    ```

* 因为发布后的文件夹结构与开发时有所不同，因此需要在代码中作区分，即[条件编译](https://stackoverflow.com/questions/3788605/if-debug-vs-conditionaldebug)：

  ```
  #if DEBUG
                .UseContentRoot(Directory.GetParent(Directory.GetCurrentDirectory()).FullName)
  #else
                .UseContentRoot(Directory.GetCurrentDirectory())
  #endif
  ```

  ```
  #if DEBUG
  			services.AddMvc().AddRazorOptions(options=>
  			{
  				options.ViewLocationExpanders.Clear();
  				options.ViewLocationExpanders.Add(new MyViewEngine());
  			});
  #else 
  			services.AddMvc();
  #endif
  ```

  由于这是一个函数中的一小部分方法改变，因此不能用`[System.Diagnostics.Conditional("DEBUG")]`属性来做。

  ​

## 7.23

* 附加到进程调试：Ctrl+Shift+R

* 解决了部署后程序不能正确运行，返回5xx错误的问题：[一次错误的解决记录](../../index.html#!pages/docs/一次错误的解决记录.md)

  ​

## 7.24

* Swagger 开启xml文档格式
* 为了能让run_server.bat运行后，应用启动成功时加载浏览器，在主程序Main函数里加了参数，如果开发环境为Debug且加了参数，则会自动打开默认浏览器

