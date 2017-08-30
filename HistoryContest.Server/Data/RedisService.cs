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

        public RedisService()
        {
            connectionString = Startup.Configuration.GetConnectionStringByDbType("Redis");
        }

        public IDatabase Database
        {
            get { return Connection.GetDatabase(); }
        }

        internal RedisKey GenerateKey<T>(string key)
        {
            return string.Concat(typeof(T).Name.ToLower(), ":", key.ToLower());
        }

        public RedisDictionary<TKey, TValue> Dictionary<TKey, TValue>(string dicName) where TValue : class
        {
            var hashKey = GenerateKey<TValue>(dicName);
            return new RedisDictionary<TKey, TValue>(this, hashKey);
        }

        #region Synchronous Methods
        public T Get<T>(string key) where T : class
        {
            RedisKey redisKey = GenerateKey<T>(key);
            string jsonString = Database.StringGet(redisKey);
            return jsonString == null? null : JsonConvert.DeserializeObject<T>(jsonString);
        }

        public bool Set<T>(string key, T value) where T : class
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
        public async Task<T> GetAsync<T>(string key) where T : class
        {
            RedisKey redisKey = GenerateKey<T>(key);
            string jsonString = await Database.StringGetAsync(redisKey);
            return jsonString == null ? null : JsonConvert.DeserializeObject<T>(jsonString);
        }

        public async Task<bool> SetAsync<T>(string key, T value) where T : class
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

    public class RedisDictionary<TKey, TValue> where TValue : class
    {
        private readonly RedisService cache;
        private readonly RedisKey hashKey;

        public RedisDictionary(RedisService cache, RedisKey hashKey)
        {
            this.cache = cache;
            this.hashKey = hashKey;
        }

        public TValue this[TKey index]
        {
            get
            {
                var field = index.ToString();
                var jsonString = cache.Database.HashGet(hashKey, field);
                return JsonConvert.DeserializeObject<TValue>(jsonString);
            }
            set
            {
                var field = index.ToString();
                var jsonString = JsonConvert.SerializeObject(value);
                cache.Database.HashSet(hashKey, field, jsonString);
            }
        }

        public async Task<TValue> GetAsync(TKey index)
        {
            return JsonConvert.DeserializeObject<TValue>(await cache.Database.HashGetAsync(hashKey, index.ToString()));
        }

        public async Task SetAsync(TKey index, TValue value)
        {
            await cache.Database.HashSetAsync(hashKey, index.ToString(), JsonConvert.SerializeObject(value));
        }

        public IEnumerable<TValue> GetAll()
        {
            return cache.Database.HashGetAll(hashKey).Select(e => JsonConvert.DeserializeObject<TValue>(e.Value.ToString()));
        }

        public async Task<IEnumerable<TValue>> GetAllAsync()
        {
            return (await cache.Database.HashGetAllAsync(hashKey)).Select(e => JsonConvert.DeserializeObject<TValue>(e.Value.ToString()));
        }

        public void SetRange(IEnumerable<TValue> range, Func<TValue, string> mapper)
        {
            Func<TValue, HashEntry> parser = v => new HashEntry(mapper(v), JsonConvert.SerializeObject(v));
            cache.Database.HashSet(hashKey, range.Select(parser).ToArray());
        }

        public async Task SetRangeAsync(IEnumerable<TValue> range, Func<TValue, string> mapper)
        {
            Func<TValue, HashEntry> parser = v => new HashEntry(mapper(v), JsonConvert.SerializeObject(v));
            await cache.Database.HashSetAsync(hashKey, range.Select(parser).ToArray());
        }
    }
}
