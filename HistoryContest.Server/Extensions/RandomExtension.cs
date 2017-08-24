using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Extensions
{
    public static class RandomExtension
    {
        internal static Dictionary<string, List<int>> HashTableDictionary = new Dictionary<string, List<int>>();

        public class HashTableContext : IDisposable
        {
            string context;
            public HashTableContext(string context)
            {
                this.context = context;
            }

            public void Dispose()
            {
                HashTableDictionary.Remove(context);
            }
        }

        // 创建一个随机数环境，这个环境在 [minValue, maxValue) 范围内随机生成不重复的数
        public static HashTableContext CreateContext(this Random random, int minValue, int maxValue, string context)
        { 
            HashTableDictionary.Add(context, new List<int>(new int[maxValue - minValue]));
            HashTableDictionary[context].Add(minValue); // 记录偏移值
            return new HashTableContext(context);
        }

        // 将context list中所有元素（除最后一个）全部置零
        public static void ResetContext(this Random random, string context)
        {
            var table = HashTableDictionary[context];
            for (int i = 0; i < table.Count - 1; ++i)
            {
                table[i] = 0;
            }
        }

        // 按照指定的环境随机生成一个不重复的数
        public static int NextNonRepetitive(this Random random, string context)
        {
            var table = HashTableDictionary[context];
            int size = table.Count - 1; // 去掉最后一个记录偏移值的数
            int num = random.Next(0, size); // Range是左闭右开
            while (table[num % size] == 1)
                num++;
            table[num % size] = 1;
            return table.Last() + num % size; // 偏移值 + size范围内随机出来的数
        }
    }
}
