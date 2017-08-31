using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HistoryContest.Server.Data;
using HistoryContest.Server.Models;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;

namespace HistoryContest.Server.Extensions
{
    public static class RedisExtension
    {
        public static RedisDictionary<string, Student> StudentEntities(this RedisService cache, Department department)
            => cache.Dictionary<string, Student>(department.ToString());

        public static RedisDictionary<string, StudentViewModel> StudentViewModels(this RedisService cache, Department department)
            => cache.Dictionary<string, StudentViewModel>(department.ToString());

        public static RedisDictionary<int, QuestionViewModel> Questions(this RedisService cache)
            => cache.Dictionary<int, QuestionViewModel>();

        public static RedisDictionary<int, CorrectAnswerViewModel> Answers(this RedisService cache)
            => cache.Dictionary<int, CorrectAnswerViewModel>();

        public static RedisDictionary<int, QuestionSeed> QuestionSeeds(this RedisService cache)
            => cache.Dictionary<int, QuestionSeed>();

        public static RedisDictionary<string, ResultViewModel> Results(this RedisService cache)
            => cache.Dictionary<string, ResultViewModel>();

        public static RedisDictionary<Department, ScoreSummaryByDepartmentViewModel> DepartmentScoreSummaries(this RedisService cache)
            => cache.Dictionary<Department, ScoreSummaryByDepartmentViewModel>();
    }
}
