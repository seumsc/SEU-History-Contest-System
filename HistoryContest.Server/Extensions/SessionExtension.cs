using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using HistoryContest.Server.Models;

namespace HistoryContest.Server.Extensions
{
    public static class SessionExtension
    {
        public static void Set<T>(this ISession session, string key, T value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static T Get<T>(this ISession session, string key)
        {
            var value = session.GetString(key);
            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }

        public static ContestSession Session(this Controller controller)
        {
            return new ContestSession(controller.HttpContext);
        }
    }

    public class ContestSession
    {
        private readonly HttpContext context;

        public ContestSession(HttpContext context)
        {
            this.context = context;
        }

        public string ID
        {
            get { return context.Session.GetString("id"); }
            set { context.Session.SetString("id", value); }
        }

        public Department? Department
        {
            get { return (Department?)context.Session.GetInt32("department"); }
            set { context.Session.SetInt32("department", (int)value); }
        }

        public DateTime? TestBeginTime
        {
            get { var time = context.Session.Get<DateTime>("beginTime"); return time == default(DateTime) ? null : (DateTime?)time; }
            set { context.Session.Set("beginTime", value ?? default(DateTime)); }
        }

        public int? SeedID
        {
            get { return context.Session.GetInt32("seed"); }
            set { context.Session.SetInt32("seed", (int)value); }
        }

        public bool IsTested
        {
            get { return context.Session.GetInt32("isTested") == 1; }
            set { context.Session.SetInt32("isTested", value ? 1 : 0); }
        }

        public bool CheckRole(string role)
        {
            return context.User.IsInRole(role);
        }
    }
}
