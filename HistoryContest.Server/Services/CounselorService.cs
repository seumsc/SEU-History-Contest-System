using HistoryContest.Server.Data;
using HistoryContest.Server.Models;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
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

        public async Task<IActionResult> CreateExcelByDepartmentid(FileInfo file, Department id)
        {
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

        public async Task<IActionResult> CreateExcelOfAllDepartments(FileInfo file)
        {
            var counselors = unitOfWork.context.Counselors.Where(m => 1==1);

            List<ScoreSummaryByDepartmentViewModel> datatable = null;
            foreach (var counselor in counselors)
            {
                datatable.Add(await ScoreSummaryByDepartmentViewModel.CreateAsync(unitOfWork,counselor));
            }

            using (ExcelPackage package = new ExcelPackage(file))
            {
                // 添加worksheet
                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("aspnetcore");
                //添加头
                worksheet.Cells[1, 1].Value = "院系";
                worksheet.Cells[1, 2].Value = "辅导员";
                worksheet.Cells[1, 3].Value = "最高分";
                worksheet.Cells[1, 4].Value = "平均分";
                worksheet.Cells[1, 5].Value = "分数分布";
                worksheet.Cells[1, 6].Value = ">=90";
                worksheet.Cells[1, 7].Value = ">=75";
                worksheet.Cells[1, 8].Value = ">=60";
                worksheet.Cells[1, 9].Value = "<60";

                //添加值
                int number = 2;
                foreach (var scoreSummary in datatable)
                {
                    worksheet.Cells[number, 1].Value = scoreSummary.DepartmentID;
                    worksheet.Cells[number, 2].Value = scoreSummary.CounselorName;
                    worksheet.Cells[number, 3].Value = scoreSummary.MaxScore;
                    worksheet.Cells[number, 4].Value = scoreSummary.AverageScore;
                    worksheet.Cells[number, 6].Value = scoreSummary.ScoreBandCount.HigherThan90;
                    worksheet.Cells[number, 7].Value = scoreSummary.ScoreBandCount.HigherThan75;
                    worksheet.Cells[number, 8].Value = scoreSummary.ScoreBandCount.HigherThan60;
                    worksheet.Cells[number, 9].Value = scoreSummary.ScoreBandCount.Failed;

                    number++;
                }

                package.Save();
            }
            return null;
        }
    }
        
}
