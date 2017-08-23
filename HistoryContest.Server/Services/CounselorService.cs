using HistoryContest.Server.Data;
using HistoryContest.Server.Models;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Services
{
    [Produces("application/json")]
    public class CounselorService
    {
        private UnitOfWork unitOfWork;

        public CounselorService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<IActionResult> CreateExcel(FileInfo file, Department id)
        {
            //TODO : <yhy>将院系得分存入缓存中   ？可能会有students (括号中) 为null
            var datatable = (await unitOfWork.StudentRepository.GetByDepartment(id)).AsQueryable().Select(s => (StudentViewModel)s);
            using (ExcelPackage package = new ExcelPackage(file))
            {
                // 添加worksheet
                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("aspnetcore");
                //添加头
                worksheet.Cells[1, 1].Value = "学号";
                worksheet.Cells[1, 2].Value = "一卡通号";
                worksheet.Cells[1, 3].Value = "姓名";
                worksheet.Cells[1, 4].Value = "是否完成";
                worksheet.Cells[1, 5].Value = "得分";
                //添加值
                int number = 2;
                foreach (var student in datatable)
                {
                    worksheet.Cells[number, 1].Value = student.StudentID;
                    worksheet.Cells[number, 2].Value = student.CardID;
                    worksheet.Cells[number, 3].Value = student.Name;
                    worksheet.Cells[number, 4].Value = student.IsCompleted ? "是" : "否";
                    worksheet.Cells[number, 5].Value = student.Score;
                    number++;
                }

                package.Save();
            }
            return null;
        }

        public async Task<ScoreSummaryOfSchoolViewModel> ScoreSummaryOfSchool()
        {
            // TODO: 全校的Score Summary来自/放入缓存, 及正确实现获取全校概况
            var model = new ScoreSummaryOfSchoolViewModel
            {
                MaxScore = await unitOfWork.StudentRepository.HighestScore(),
                AverageScore = await unitOfWork.StudentRepository.AverageScore(),
                ScoreBandCount =
                {
                    HigherThan90 = await unitOfWork.StudentRepository.ScoreHigherThan(90),
                    HigherThan75 = await unitOfWork.StudentRepository.ScoreHigherThan(75),
                    HigherThan60 = await unitOfWork.StudentRepository.ScoreHigherThan(60)
                },
                UpdateTime = DateTime.Now
            };
            model.ScoreBandCount.Failed = await unitOfWork.StudentRepository.SizeAsync() - model.ScoreBandCount.HigherThan60;
            return model;
        }

        public async Task<ScoreSummaryByDepartmentViewModel> ScoreSummaryByDepartment(Counselor counselor)
        {
            // TODO: Score Summary放入缓存
            var model = new ScoreSummaryByDepartmentViewModel
            {
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
        
}
