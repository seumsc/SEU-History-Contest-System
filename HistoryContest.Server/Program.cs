using HistoryContest.Server.Services;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Dynamic;
using System.IO;
using System.Net;
using System.Threading;

namespace HistoryContest.Server
{
    public static class Program
    {
        public static bool FromMain { get; set; } = false;
        public static bool RefreshCache { get; set; } = false;
        public static int Port { get; set; } = 5000;
        public static string EnvironmentName { get; set; } = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        public static string ContentRootPath { get; set; } = EnvironmentName.ToLowerInvariant() == "development" ?
            Directory.GetParent(Directory.GetCurrentDirectory()).FullName : Directory.GetCurrentDirectory();

        public static void Main(string[] args)
        {
            FromMain = true;
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            //Directory.SetCurrentDirectory(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location));
            ProcessArgs(args);
            return new WebHostBuilder()
                .UseKestrel(option => option.Listen(IPAddress.Loopback, Port))
                .UseContentRoot(ContentRootPath)
                .UseIISIntegration()
                .UseApplicationInsights()
                .UseStartup<Startup>()
                .Build();
        }

        internal static void ProcessArgs(string[] args)
        {
            bool runBrowser = false;
            dynamic envSetting = new ExpandoObject();
            dynamic parseSetting = new ExpandoObject();

            envSetting.SwitchEnv = false;
            parseSetting.Type = null;

            for (int i = 0; i < args.Length; ++i)
            {
                var arg = args[i];
                switch (arg)
                {
                    case "-p":
                    case "--port":
                        ++i;
                        Port = int.Parse(args[i]);
                        break;
                    case "-rb":
                    case "--runbrowser":
                        runBrowser = true;
                        break;
                    case "-env":
                    case "--environment":
                        ++i;
                        envSetting = new { SwitchEnv = true, EnvName = args[i] };
                        break;
                    case "--refresh-cache":
                        RefreshCache = true;
                        break;
                    case "--parse-question-sql":
                        ++i;
                        parseSetting = new { Type = "question", Format = "sql", Path = args[i] };
                        break;
                    case "--parse-student-text":
                        ++i;
                        parseSetting = new { Type = "student", Format = "text", Path = args[i] };
                        break;
                    case "--parse-student-excel":
                        ++i;
                        parseSetting = new { Type = "student", Format = "excel", Path = args[i] };
                        break;
                    case "-h":
                    case "--help":
                        string[] messages = new string[]
                        {
                            "-h|--help                      显示帮助。",
                            "-p|--port <ID>                 在指定端口运行服务器。默认为5000",
                            "-rb|--runbrowser               程序启动后运行默认浏览器打开网站。",
                            "-env|--environment <env>       设置程序运行环境。默认为Production。",
                            "--refresh-cache                清除并从数据库中重新加载缓存。Development环境下该开关无效，总是重新加载。",
                            "--parse-question-sql <path>    解析一个SQL格式问题集到json数据文件。",
                            "--parse-student-text <path>    解析一个文本格式学生信息集到json数据文件。",
                            "--parse-student-excel <path>   解析一个Excel格式学生信息集到json数据文件。"
                        };
                        foreach (var message in messages)
                        {
                            Console.WriteLine(message);
                        }
                        Environment.Exit(0);
                        break;
                }
            }

            #region Environment Setting
            if (envSetting.SwitchEnv == true)
            {
                switch ((envSetting.EnvName as string).ToLowerInvariant())
                {
                    case "development":
                        EnvironmentName = "Development";
                        break;
                    case "staging":
                        EnvironmentName = "Staging";
                        break;
                    case "production":
                        EnvironmentName = "Production";
                        break;
                    default:
                        throw new ArgumentException("Enviroment name provided invalid. Please choose one in \"Development\", \"Production\", or \"Staging\"");
                }
            }

            switch (EnvironmentName)
            {
                case "Development":
                    ContentRootPath = Directory.GetParent(Directory.GetCurrentDirectory()).FullName;
                    break;
                case "Staging":
                case "Production":
                    ContentRootPath = Directory.GetCurrentDirectory();
                    break;
            }
            #endregion

            if (parseSetting.Type != null)
            {
                switch (parseSetting.Type as string)
                {
                    case "question":
                        switch(parseSetting.Format as string)
                        {
                            case "sql":
                                DocParseService.ParseQuestionsFromSQL(parseSetting.Path as string, DocParseService.QuestionSqlFilePattern);
                                break;
                        }
                        break;
                    case "student":
                        switch (parseSetting.Format as string)
                        {
                            case "text":
                                DocParseService.ParseStudentsFromText(parseSetting.Path as string);
                                break;
                            case "excel":
                                DocParseService.ParseStudentsFromExcel(parseSetting.Path as string);
                                break;
                        }
                        break;
                }
                Environment.Exit(0);
            }

            if (runBrowser)
            {
                new Timer(o =>
                {
                    string url = @"http://localhost:" + Port;
                    Console.WriteLine(@"Starting " + url + " with default browser...");
                    System.Diagnostics.Process.Start("explorer", url);
                }, null, (int)TimeSpan.FromSeconds(10).TotalMilliseconds, Timeout.Infinite);
            }
        }
    }
}
