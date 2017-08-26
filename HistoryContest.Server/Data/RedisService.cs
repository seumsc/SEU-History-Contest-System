using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;

namespace HistoryContest.Server.Data
{
    public class RedisService
    {
        private static string connectionString = string.Empty;

        private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.Connect(connectionString));

        public static ConnectionMultiplexer Connection
        {
            get { return lazyConnection.Value; }
        }

        public RedisService(IConfigurationRoot configuration)
        {
            connectionString = configuration.GetConnectionStringByDatabase("Redis");
        }

        public IDatabase Database
        {
            get { return Connection.GetDatabase(); }
        }

        private RedisKey GenerateKey<T>(string key)
        {
            return string.Concat(key.ToLower(), ":", typeof(T).Name.ToLower());
        }

        #region Synchronous Methods
        public T Get<T>(string key)
        {
            RedisKey redisKey = GenerateKey<T>(key);
            string jsonString = Database.StringGet(redisKey);
            return JsonConvert.DeserializeObject<T>(key);
        }

        public bool Set<T>(string key, T value)
        {
            if (value == null || string.IsNullOrWhiteSpace(key) || key.Contains(":"))
            {
                return false;
            }

            RedisKey redisKey = GenerateKey<T>(key);
            string jsonString = JsonConvert.SerializeObject(value);
            return Database.StringSet(redisKey, jsonString);
        }

        public bool Delete<T>(string key)
        {
            if (string.IsNullOrWhiteSpace(key) || key.Contains(":"))
            {
                return false;
            }

            key = GenerateKey<T>(key);
            return Database.KeyDelete(key);
        }
        #endregion

        #region Asynchronous Methods
        public async Task<T> GetAsync<T>(string key)
        {
            RedisKey redisKey = GenerateKey<T>(key);
            string jsonString = await Database.StringGetAsync(redisKey);
            return JsonConvert.DeserializeObject<T>(key);
        }

        public async Task<bool> SetAsync<T>(string key, T value)
        {
            if (value == null || string.IsNullOrWhiteSpace(key) || key.Contains(":"))
            {
                return false;
            }

            RedisKey redisKey = GenerateKey<T>(key);
            string jsonString = JsonConvert.SerializeObject(value);
            return await Database.StringSetAsync(redisKey, jsonString);
        }

        public async Task<bool> DeleteAsync<T>(string key)
        {
            if (string.IsNullOrWhiteSpace(key) || key.Contains(":"))
            {
                return false;
            }

            key = GenerateKey<T>(key);
            return await Database.KeyDeleteAsync(key);
        }
        #endregion
    }
}
