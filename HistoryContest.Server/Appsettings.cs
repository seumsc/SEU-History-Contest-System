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
        public static string GetConnectionStringByDatabase(this IConfigurationRoot configuration, string dbName)
            => configuration.GetSection("ConnectionStrings").GetSection(dbName).GetValue<string>(Startup.Environment.EnvironmentName);
    }

    public class ContestSetting
    {

    }
}
