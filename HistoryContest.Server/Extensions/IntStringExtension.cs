using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Extensions
{
    public static class IntStringExtension
    {
        public static string ToStringID(this int hexInt)
            => hexInt.ToString("X").PadLeft(8, '0');

        public static int ToIntID(this string hexString)
            => Convert.ToInt32(hexString, 16);
    }
}
