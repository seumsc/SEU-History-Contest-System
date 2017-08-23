using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HistoryContest.Server.Data;
using HistoryContest.Server.Models.Entities;

namespace HistoryContest.Server.Models.ViewModels
{
    public class ScoreBandCountViewModel
    {
        public int HigherThan90 { get; set; }
        public int HigherThan75 { get; set; }
        public int HigherThan60 { get; set; }
        public int Failed { get; set; }
    }

    public class ScoreSummaryByDepartmentViewModel
    {
        public Department? DepartmentID { get; set; }
        public string CounselorName { get; set; }
        public int MaxScore { get; set; }
        public double AverageScore { get; set; }
        public ScoreBandCountViewModel ScoreBandCount { get; set; }

        public static async Task<ScoreSummaryByDepartmentViewModel> CreateAsync(UnitOfWork unitOfWork, Counselor counselor)
        {
            var model = new ScoreSummaryByDepartmentViewModel
            { // TODO: Score Summary放入缓存
                DepartmentID = counselor.Department,
                CounselorName = counselor.Name,
                MaxScore = await unitOfWork.StudentRepository.HighestScoreByDepartment(counselor.Department),
                AverageScore = await unitOfWork.StudentRepository.AverageScoreByDepartment(counselor.Department),
                ScoreBandCount =
                {
                    HigherThan90 = await unitOfWork.StudentRepository.ScoreHigherThanByDepartment(90, counselor.Department),
                    HigherThan75 = await unitOfWork.StudentRepository.ScoreHigherThanByDepartment(75, counselor.Department),
                    HigherThan60 = await unitOfWork.StudentRepository.ScoreHigherThanByDepartment(60, counselor.Department)
                }
            };
            model.ScoreBandCount.Failed = await unitOfWork.StudentRepository.SizeByDepartment(counselor.Department) - model.ScoreBandCount.HigherThan60;
            return model;
        }
    }

    public class ScoreSummaryOfSchoolViewModel
    {
        public int MaxScore { get; set; }
        public double AverageScore { get; set; }
        public ScoreBandCountViewModel ScoreBandCount { get; set; }
        public int NumberTested { get; set; }
        public int NumberNotTested { get; set; }
        public DateTime UpdateTime { get; set; }

        public static async Task<ScoreSummaryOfSchoolViewModel> CreateAsync(UnitOfWork unitOfWork)
        {
            var model = new ScoreSummaryOfSchoolViewModel
            {// TODO: 全校的Score Summary来自/放入缓存, 及正确实现获取全校概况
                MaxScore = await unitOfWork.StudentRepository.HighestScore(),
                AverageScore = await unitOfWork.StudentRepository.AverageScore(),
                ScoreBandCount =
                {
                    HigherThan90 = await unitOfWork.StudentRepository.ScoreHigherThan(90),
                    HigherThan75 = await unitOfWork.StudentRepository.ScoreHigherThan(75),
                    HigherThan60 = await unitOfWork.StudentRepository.ScoreHigherThan(60)
                },
                NumberNotTested = 0,
                UpdateTime = DateTime.Now
            };
            var size = await unitOfWork.StudentRepository.SizeAsync();
            model.ScoreBandCount.Failed = size - model.ScoreBandCount.HigherThan60;
            model.NumberTested = size - model.NumberNotTested;
            return model;
        }
    }
}
