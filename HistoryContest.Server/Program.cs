using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Dynamic;
using Microsoft.AspNetCore.Hosting;
using HistoryContest.Server.Services;

namespace HistoryContest.Server
{
    public static class Program
    {
        public static bool FromMain { get; set; } = false;
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
            ProcessArgs(args);
            return new WebHostBuilder()
                .UseKestrel()
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
                    case "-rb":
                    case "--runbrowser":
                        runBrowser = true;
                        break;
                    case "-env":
                    case "--environment":
                        ++i;
                        envSetting = new { SwitchEnv = true, EnvName = args[i] };
                        break;
                    case "--parse-question-sql":
                        ++i;
                        parseSetting = new { Type = "question", Format = "sql", Path = args[i] };
                        break;
                    case "--parse-student-sql":
                        ++i;
                        parseSetting = new { Type = "student", Format = "sql", Path = args[i] };
                        break;
                    case "-h":
                    case "--help":
                        string[] messages = new string[]
                        {
                            "-h|--help                     显示帮助。",
                            "-rb|--runbrowser              程序启动后运行默认浏览器打开网站。",
                            "-env|--environment <env>      设置程序运行环境。默认为\"Production\"。",
                            "--parse-question-sql <path>   解析一个sql格式问题集到json数据文件。"
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
                switch (envSetting.EnvName as string)
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
                                DocParseService.ParseQuestions(parseSetting.Path as string, DocParseService.QuestionSqlFilePattern);
                                break;
                        }
                        break;
                    case "student":
                        switch (parseSetting.Format as string)
                        {
                            case "sql":
                                DocParseService.ParseStudentInformation(parseSetting.Path as string);
                                break;
                        }
                        break;
                }
                Environment.Exit(0);
            }

            if (runBrowser)
            {
                string url = @"http://localhost:5000";
                Console.WriteLine(@"Starting " + url + " with default browser...");
                System.Diagnostics.Process.Start("explorer", url);
            }
        }
    }
}
