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

        public static ConnectionMultiplexer Connection => lazyConnection.Value;

        public RedisService()
        {
            connectionString = Startup.Configuration.GetConnectionStringByDbType("Redis");
        }

        public IDatabase Database => Connection.GetDatabase();

        internal RedisKey GenerateKey<T>(string key)
        {
            return string.Concat(typeof(T).Name.ToLower(), ":", key.ToLower());
        }

        public RedisDictionary<TKey, TValue> Dictionary<TKey, TValue>(string dicName = "", Func<TKey, string> parser = null) where TValue : class
        {
            if (dicName != "")
            {
                var hashKey = GenerateKey<TValue>(dicName);
                return new RedisDictionary<TKey, TValue>(this, hashKey, parser);
            }
            else
            {
                return new RedisDictionary<TKey, TValue>(this, parser);
            }
        }

        #region Synchronous Methods
        public T Get<T>(string key) where T : class
        {
            RedisKey redisKey = GenerateKey<T>(key);
            string jsonString = Database.StringGet(redisKey);
            return jsonString == null? null : JsonConvert.DeserializeObject<T>(jsonString);
        }

        public bool Set<T>(string key, T value, TimeSpan? expiry = null) where T : class
        {
            if (value == null || string.IsNullOrWhiteSpace(key) || key.Contains(":"))
            {
                return false;
            }

            RedisKey redisKey = GenerateKey<T>(key);
            string jsonString = JsonConvert.SerializeObject(value);
            return Database.StringSet(redisKey, jsonString, expiry);
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

        public bool HasKey<T>(string key)
        {
            var redisKey = GenerateKey<T>(key);
            return Database.KeyExists(redisKey);
        }
        #endregion

        #region Asynchronous Methods
        public async Task<T> GetAsync<T>(string key) where T : class
        {
            RedisKey redisKey = GenerateKey<T>(key);
            string jsonString = await Database.StringGetAsync(redisKey);
            return jsonString == null ? null : JsonConvert.DeserializeObject<T>(jsonString);
        }

        public async Task<bool> SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class
        {
            if (value == null || string.IsNullOrWhiteSpace(key) || key.Contains(":"))
            {
                return false;
            }
            RedisKey redisKey = GenerateKey<T>(key);
            string jsonString = JsonConvert.SerializeObject(value);
            return await Database.StringSetAsync(redisKey, jsonString, expiry);
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

        public async Task<bool> HasKeyAsync<T>(string key)
        {
            var redisKey = GenerateKey<T>(key);
            return await Database.KeyExistsAsync(redisKey);
        }
        #endregion
    }

    public class RedisDictionary<TKey, TValue> where TValue : class
    {
        private readonly RedisService cache;
        private readonly RedisKey hashKey;
        private readonly Func<TKey, string> parser;

        public RedisDictionary(RedisService cache, Func<TKey, string> parser = null)
        {
            this.cache = cache;
            this.hashKey = typeof(TValue).Name;
            this.parser = parser?? (key => key.ToString());
        }

        public RedisDictionary(RedisService cache, RedisKey hashKey, Func<TKey, string> parser = null)
        {
            this.cache = cache;
            this.hashKey = hashKey;
            this.parser = parser ?? (key => key.ToString());
        }

        public long Count => cache.Database.HashLength(hashKey);

        public Func<TKey, string> Parser => parser;

        public TValue this[TKey index]
        {
            get
            {
                var field = parser(index);
                var jsonString = cache.Database.HashGet(hashKey, field);
                return jsonString.HasValue? JsonConvert.DeserializeObject<TValue>(jsonString) : null;
            }
            set
            {
                var field = parser(index);
                var jsonString = JsonConvert.SerializeObject(value);
                cache.Database.HashSet(hashKey, field, jsonString);
            }
        }

        public async Task<long> CountAsync()
        {
            return await cache.Database.HashLengthAsync(hashKey);
        }

        public async Task<TValue> GetAsync(TKey index)
        {
            var field = parser(index);
            var jsonString = await cache.Database.HashGetAsync(hashKey, field);
            return jsonString.HasValue ? JsonConvert.DeserializeObject<TValue>(jsonString) : null;
        }

        public async Task SetAsync(TKey index, TValue value)
        {
            await cache.Database.HashSetAsync(hashKey, parser(index), JsonConvert.SerializeObject(value));
        }

        public List<string> GetAllStringKeys()
        {
            return cache.Database.HashKeys(hashKey).Select(v => v.ToString()).ToList();
        }

        public async Task<List<string>> GetAllStringKeysAsync()
        {
            return (await cache.Database.HashKeysAsync(hashKey)).Select(e => e.ToString()).ToList();
        }

        public List<TValue> GetAllValues()
        {
            return cache.Database.HashValues(hashKey).Select(v => JsonConvert.DeserializeObject<TValue>(v.ToString())).ToList();
        }

        public async Task<List<TValue>> GetAllValuesAsync()
        {
            return (await cache.Database.HashValuesAsync(hashKey)).Select(e => JsonConvert.DeserializeObject<TValue>(e.ToString())).ToList();
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
