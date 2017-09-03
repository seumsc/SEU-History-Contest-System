using HistoryContest.Server.Data;
using HistoryContest.Server.Extensions;
using HistoryContest.Server.Models;
using HistoryContest.Server.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;

namespace HistoryContest.Server.Services
{
    [Produces("application/json")]
    public class ExcelExportService
    {
        private UnitOfWork unitOfWork;

        public ExcelExportService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<IActionResult> CreateExcelByDepartmentid(Department id)
        {
            string sWebRootFolder = Startup.Environment.WebRootPath;
            string sFileName = @"excel/" + id.ToString() + ".xlsx";

            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            if (!file.Exists)
            {
                var datatable = (await unitOfWork.StudentRepository.GetByDepartment(id)).AsQueryable().Select(s => (StudentViewModel)s);
                using (ExcelPackage package = new ExcelPackage(file))
                {
                    // 添加worksheet
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("1");
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

                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
                    worksheet.View.ShowGridLines = false;//去掉sheet的网格线
                    worksheet.Cells.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells.Style.Fill.BackgroundColor.SetColor(Color.LightYellow);//设置背景色

                    package.Save();
                }

                using (ExcelPackage package = new ExcelPackage(file))
                {
                    // 添加worksheet
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];
                    var rowCnt = worksheet.Dimension.End.Row;
                    var colCnt = worksheet.Dimension.End.Column;
                    for (int i = 1; i <= rowCnt; i++)
                        if (i % 2 == 0)
                            for (int j = 1; j <= colCnt; j++)
                            {
                                worksheet.Cells[i, j].Style.Fill.PatternType = ExcelFillStyle.Solid;
                                worksheet.Cells[i, j].Style.Fill.BackgroundColor.SetColor(Color.LightBlue);
                            }

                    package.Save();
                }

            }
            return null;
        }

        public async Task<IActionResult> CreateExcelOfAllDepartments()
        {
            string sWebRootFolder = Startup.Environment.WebRootPath;
            string sFileName = @"excel/" + "ScoreSummaryOfAllDepartments.xlsx";
            
            
            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            if (!file.Exists)
            {
                var datatable =unitOfWork.DbContext.Counselors.Select(m=>  ScoreSummaryByDepartmentViewModel.GetAsync(unitOfWork, m)).ToList();
                using (ExcelPackage package = new ExcelPackage(file))
                {
                    // 添加worksheet
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("1");
                    //添加头
                    worksheet.Cells[1, 1].Value = "院系";
                    worksheet.Cells[1, 2].Value = "辅导员";
                    worksheet.Cells[1, 3].Value = "最高分";
                    worksheet.Cells[1, 4].Value = "平均分";
                    worksheet.Cells[1, 5].Value = ">=90";
                    worksheet.Cells[1, 6].Value = ">=75";
                    worksheet.Cells[1, 7].Value = ">=60";
                    worksheet.Cells[1, 8].Value = "不及格";
                    worksheet.Cells[1, 9].Value = "未测试";

                    //添加值
                    int number = 2;
                    foreach (var scoreSummarytask in datatable)
                    {
                        var scoreSummary = await scoreSummarytask;
                        worksheet.Cells[number, 1].Value = scoreSummary.DepartmentID;
                        worksheet.Cells[number, 2].Value = scoreSummary.CounselorName;
                        worksheet.Cells[number, 3].Value = scoreSummary.MaxScore;
                        worksheet.Cells[number, 4].Value = scoreSummary.AverageScore;
                        worksheet.Cells[number, 5].Value = scoreSummary.ScoreBandCount.HigherThan90;
                        worksheet.Cells[number, 6].Value = scoreSummary.ScoreBandCount.HigherThan75;
                        worksheet.Cells[number, 7].Value = scoreSummary.ScoreBandCount.HigherThan60;
                        worksheet.Cells[number, 8].Value = scoreSummary.ScoreBandCount.Failed;
                        worksheet.Cells[number, 9].Value = scoreSummary.ScoreBandCount.NotTested;
                        

                        number++;
                    }

                    number++;
                    //最后空一行添加去全校概况
                    worksheet.Cells[number, 2].Value = "最高分";
                    worksheet.Cells[number, 3].Value = "平均分";
                    worksheet.Cells[number, 4].Value = ">=90";
                    worksheet.Cells[number, 5].Value = ">=75";
                    worksheet.Cells[number, 6].Value = ">=60";
                    worksheet.Cells[number, 7].Value = "不及格";
                    worksheet.Cells[number, 8].Value = "未测试";
                    worksheet.Cells[number, 9].Value = "更新时间";
                    
                    number++;

                    var model = await ScoreSummaryOfSchoolViewModel.GetAsync(unitOfWork);
                    worksheet.Cells[number, 1].Value = "全校分数概况";
                    worksheet.Cells[number, 2].Value = model.MaxScore;
                    worksheet.Cells[number, 3].Value = model.AverageScore;
                    worksheet.Cells[number, 4].Value = model.ScoreBandCount.HigherThan90;
                    worksheet.Cells[number, 5].Value = model.ScoreBandCount.HigherThan75;
                    worksheet.Cells[number, 6].Value = model.ScoreBandCount.HigherThan60;
                    worksheet.Cells[number, 7].Value = model.ScoreBandCount.Failed;
                    worksheet.Cells[number, 8].Value = model.ScoreBandCount.NotTested;
                    worksheet.Cells[number, 9].Value = model.UpdateTime.ToString("yyyy-MM-dd HH:mm:ss");

                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
                    worksheet.View.ShowGridLines = false;//去掉sheet的网格线
                    worksheet.Cells.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells.Style.Fill.BackgroundColor.SetColor(Color.LightYellow);//设置背景色

                    package.Save();
                }

                using (ExcelPackage package = new ExcelPackage(file))
                {
                    // 添加worksheet
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];
                    var rowCnt = worksheet.Dimension.End.Row;
                    var colCnt = worksheet.Dimension.End.Column;
                    for (int i = 1; i <= rowCnt; i++)
                        if (i % 2 == 0)
                            for(int j = 1; j <= colCnt; j++)
                            {
                                worksheet.Cells[i, j].Style.Fill.PatternType = ExcelFillStyle.Solid;
                                worksheet.Cells[i, j].Style.Fill.BackgroundColor.SetColor(Color.LightBlue);
                            }

                    package.Save();
                }

            }
            return null;
        }

        public void UpdateExcelByDepartmentid(StudentViewModel student)
        {
            string sWebRootFolder = Startup.Environment.WebRootPath;
            string sFileName1 = @"excel/" + student.StudentID.ToDepartmentID().ToString() + ".xlsx";

            FileInfo file1 = new FileInfo(Path.Combine(sWebRootFolder, sFileName1));
            if (!file1.Exists) return;
            using (ExcelPackage package = new ExcelPackage(file1))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[1];
                int tot =unitOfWork.DbContext.Students.Count(m => student.StudentID.ToDepartmentID() == m.Department);
                for (int i = 2; i < tot + 2; i++)
                    if (Convert.ToString(worksheet.Cells[i, 1].Value)== student.StudentID)
                    {
                        worksheet.Cells[i, 4].Value = "是";
                        worksheet.Cells[i, 5].Value = student.Score;
                        break;
                    }
                package.Save();
            }

            string sFileName2 = @"excel/" + "ScoreSummaryOfAllDepartments.xlsx";
            FileInfo file2 = new FileInfo(Path.Combine(sWebRootFolder, sFileName2));
            if (!file2.Exists) return;
            using (ExcelPackage package = new ExcelPackage(file2))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[1];
                var std = unitOfWork.DbContext.Students.FirstOrDefault(m=>m.Name==student.Name);
                int tot = unitOfWork.DbContext.Counselors.Count();
                for (int i = 2; i < tot + 2; i++)
                    if (Convert.ToString(worksheet.Cells[i, 2].Value) == std.Counselor.Name)
                    {
                        int MaxScore, AverageScore, HigherThan90, HigherThan75, HigherThan60, Failed, NotTested;
                        MaxScore = Convert.ToInt32(worksheet.Cells[i, 3].Value);
                        AverageScore = Convert.ToInt32(worksheet.Cells[i, 4].Value);
                        HigherThan90 = Convert.ToInt32(worksheet.Cells[i, 5].Value);
                        HigherThan75 = Convert.ToInt32(worksheet.Cells[i, 6].Value);
                        HigherThan60 = Convert.ToInt32(worksheet.Cells[i, 7].Value);
                        Failed = Convert.ToInt32(worksheet.Cells[i, 8].Value);
                        NotTested = Convert.ToInt32(worksheet.Cells[i, 9].Value);
                        int num = NotTested + Failed + HigherThan60;
                        AverageScore *= num - NotTested;
                        int score = student.Score??0;
                        AverageScore += score;
                        NotTested--;
                        AverageScore /= NotTested;
                        MaxScore = Math.Max(MaxScore,score);
                        if (score < 60) { Failed++; }
                        else
                        {
                            HigherThan60++; 
                            if (score >= 75)
                            {
                                HigherThan75++;
                                if (score >= 90) HigherThan90++;
                            }
                        }
                        worksheet.Cells[i, 3].Value = MaxScore;
                        worksheet.Cells[i, 4].Value = AverageScore;
                        worksheet.Cells[i, 5].Value = HigherThan90;
                        worksheet.Cells[i, 6].Value = HigherThan75;
                        worksheet.Cells[i, 7].Value = HigherThan60;
                        worksheet.Cells[i, 8].Value = Failed;
                        worksheet.Cells[i, 9].Value = NotTested;
                        break;
                    }

                package.Save();
            }

            return;
        }

        public void UpdateExcelOfSchool()
        {
            string sWebRootFolder = Startup.Environment.WebRootPath;
            string sFileName = @"excel/" + "ScoreSummaryOfAllDepartments.xlsx";

            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            if (!file.Exists) return;
            

            //无法使用异步 -_-  所有数据的异步访问都不可用  通过计算更新
            var model = new ScoreSummaryOfSchoolViewModel {
                MaxScore = 0,
                AverageScore = 0,
                ScoreBandCount = new ScoreBandCountViewModel()
                {
                    HigherThan90 = 0,
                    HigherThan75 = 0,
                    HigherThan60 = 0,
                    Failed = 0,
                    NotTested= 0
                },
                UpdateTime =DateTime.Now
            };
            int number = unitOfWork.DbContext.Counselors.Count();
            int x;
            double y;
            using (ExcelPackage package = new ExcelPackage(file))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[1];

                //添加值
                for(int i = 2;i < number+2;i++)
                {
                    x = Convert.ToInt32(worksheet.Cells[i, 3].Value);
                    model.MaxScore=  Math.Max(model.MaxScore, x);

                    y = Convert.ToDouble(worksheet.Cells[i, 4].Value);
                    model.AverageScore+=y;

                    x = Convert.ToInt32(worksheet.Cells[i, 5].Value);
                    model.ScoreBandCount.HigherThan90+=x;

                    x = Convert.ToInt32(worksheet.Cells[i, 6].Value);
                    model.ScoreBandCount.HigherThan75 += x;

                    x = Convert.ToInt32(worksheet.Cells[i, 7].Value);
                    model.ScoreBandCount.HigherThan60 += x;

                    x = Convert.ToInt32(worksheet.Cells[i, 8].Value);
                    model.ScoreBandCount.Failed += x;

                    x = Convert.ToInt32(worksheet.Cells[i, 9].Value);
                    model.ScoreBandCount.NotTested += x;

                }
                model.AverageScore = model.AverageScore / number;
                
                worksheet.Cells[number + 4, 2].Value = model.MaxScore;
                worksheet.Cells[number + 4, 3].Value = model.AverageScore;
                worksheet.Cells[number + 4, 4].Value = model.ScoreBandCount.HigherThan90;
                worksheet.Cells[number + 4, 5].Value = model.ScoreBandCount.HigherThan75;
                worksheet.Cells[number + 4, 6].Value = model.ScoreBandCount.HigherThan60;
                worksheet.Cells[number + 4, 7].Value = model.ScoreBandCount.Failed;
                worksheet.Cells[number + 4, 8].Value = model.ScoreBandCount.NotTested;
                worksheet.Cells[number + 4, 9].Value = model.UpdateTime.ToString("yyyy-MM-dd HH:mm:ss");
                package.Save();
            }

            return;
        }
    }
        
}
