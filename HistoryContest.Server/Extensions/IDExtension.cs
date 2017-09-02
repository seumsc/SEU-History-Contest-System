using HistoryContest.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Extensions
{
    public static class IDExtension
    {
        public static string ToStringID(this int hexInt)
            => hexInt.ToString("X").PadLeft(8, '0');

        public static int ToIntID(this string hexString)
            => Convert.ToInt32(hexString, 16);

        public static Department ToDepartmentID(this string studentID)
            => (Department)(int.Parse(studentID.Substring(0, 2)));

        public static bool IsHexNumber(this string hexString)
            => int.TryParse(hexString, System.Globalization.NumberStyles.HexNumber, null, out int result);

        public static bool IsDepartmentID(this Controller controller, string ID)
            => Enum.IsDefined(typeof(Department), ID.ToDepartmentID());

        public static bool IsStudentID(this Controller controller, string ID)
        {
            var a = ID.Length == 8;
            var b = a && ID.IsHexNumber();
            var c = b && controller.IsDepartmentID(ID.Substring(0, 2));
            var d = c && int.Parse(ID.Substring(3, 2)) <= 17 && int.Parse(ID.Substring(3, 2)) >= 12;
            return d;
        }
        //=> ID.Length == 8 && ID.IsHexNumber() && controller.IsDepartmentID(ID.Substring(0, 2)) && int.Parse(ID.Substring(3, 2)) <= 17 && int.Parse(ID.Substring(3, 2)) >= 12;
    }
}
