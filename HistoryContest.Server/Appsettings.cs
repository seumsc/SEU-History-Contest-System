using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server
{
    public static class ConfigurationExtension
    {
        // 按照数据库类型及当前环境返回对应的connection string。
        public static string GetConnectionStringByDbType(this IConfigurationRoot configuration, string dbName)
            => configuration.GetSection("ConnectionStrings").GetSection(dbName).GetValue<string>(Startup.Environment.EnvironmentName);
    }

    public class ContestSetting
    {
        public class QuestionCounts
        {
            public int Choice { get; set; }
            public int TrueFalse { get; set; }
        }

        public QuestionCounts QuestionCount { get; set; }
        public int QuestionSeedScale { get; set; }
        public TimeSpan TestTime { get; set; }
        public TimeSpan SchoolScoreSummaryExpireTime { get; set; }
        public string[] VPNConnection { get; set; }
    }
}
