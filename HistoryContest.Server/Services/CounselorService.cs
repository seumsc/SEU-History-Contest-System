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
    }      
}
