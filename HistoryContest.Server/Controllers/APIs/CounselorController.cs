using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HistoryContest.Server.Models;
using HistoryContest.Server.Models.ViewModels;
using HistoryContest.Server.Data;
using System.IO;
using OfficeOpenXml;
using Microsoft.AspNetCore.Hosting;

namespace HistoryContest.Server.Controllers.APIs
{
    [Authorize(Roles = "Counselor, Administrator")]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class CounselorController : Controller
    {
        private readonly UnitOfWork unitOfWork;
        private IHostingEnvironment hostingEnvironment;

        public CounselorController(UnitOfWork unitOfWork, IHostingEnvironment hostingEnvironment)
        {
            this.unitOfWork = unitOfWork;
            this.hostingEnvironment = hostingEnvironment;
            unitOfWork.StudentRepository.LoadStudentsFromCounselors();
        }
        
        /// <summary>
        /// 下载当前辅导员所在院系所有学生分数情况的EXCEL表
        /// </summary>
        /// <remarks>
        ///     无参数
        ///     尚未测试
        /// </remarks>
        /// <returns>院系学生EXCEL</returns>
        /// <response code="200">返回本院系得分EXCEL</response>
        [HttpGet("xlsx")]
        public async Task<IActionResult> Export()
        {
            string sWebRootFolder = hostingEnvironment.WebRootPath;
            string sFileName = "123321.xlsx";

            // TODO : 改成从session中获取DepartmentID
            var counselorid = int.Parse(HttpContext.Session.GetString("id"));
            var id = (unitOfWork.CounselorRepository.GetByID(counselorid)).Department;

            var datatable=(await unitOfWork.StudentRepository.GetByDepartment(id)).AsQueryable().Select(s => (StudentViewModel)s);
            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
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
                foreach(var student in datatable)
                {
                    worksheet.Cells[number, 1].Value = student.StudentID;
                    worksheet.Cells[number, 2].Value = student.CardID;
                    worksheet.Cells[number, 3].Value = student.Name;
                    worksheet.Cells[number, 4].Value = student.IsCompleted?"是":"否";
                    worksheet.Cells[number, 5].Value = student.Score;
                    number++;
                }
                
                package.Save();
            }
            return File(sFileName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }

        /// <summary>
        /// 按院系代码获取所有学生分数
        /// </summary>
        /// <remarks>
        ///    拒绝查询其他院系得分详情，在辅导员查询本院系学生得分详情时使用
        /// </remarks>
        /// <returns>院系学生得分</returns>
        /// <response code="200">返回本院系得分详情</response>
        /// <response code="403">不允许辅导员查询不同系学生的数据</response>
        [HttpGet("scores/all/{id}")]
        [ProducesResponseType(typeof(IEnumerable<StudentViewModel>), 200)]
        public async Task<IActionResult> AllScoresByDepartment(Department id)
        {
            if (!HttpContext.User.IsInRole("Administrator") 
                && id != unitOfWork.CounselorRepository.GetByID(int.Parse(HttpContext.Session.GetString("id"))).Department)
            { // 不允许辅导员查询不同系学生的数据
                return Forbid();
            }

            return Json((await unitOfWork.StudentRepository.GetByDepartment(id)).AsQueryable().Select(s => (StudentViewModel)s));
        }

        /// <summary>
        /// 按学号获取单个学生分数
        /// </summary>
        /// <remarks>
        ///    学生得分详情JSON格式如下：
        ///    
        ///         {
        ///             "studentID"： int,
        ///             "cardID": int,
        ///             "Name": string,
        ///             "isCompleted": bool,
        ///             "score": int?
        ///         }
        ///     
        /// </remarks>
        /// <returns>学生得分</returns>
        /// <response code="200">返回学生得分</response>
        /// <response code="404">id对应学生不存在</response>
        /// <response code="403">不允许辅导员查询不同系学生的数据</response>
        [HttpGet("scores/single/{id}")]
        [ProducesResponseType(typeof(StudentViewModel), 200)]
        public async Task<IActionResult> StudentScoreById(int id)
        {
            var student = await unitOfWork.StudentRepository.GetByIDAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            if (!HttpContext.User.IsInRole("Administrator") && student.CounselorID != int.Parse(HttpContext.Session.GetString("id")))
            { // 不允许辅导员查询不同系学生的数据
                return Forbid();
            }

            return Json((StudentViewModel)student);
        }

        /// <summary>
        /// 获取全校分数概况
        /// </summary>
        /// <remarks>
        ///    全校分数概况JSON格式如下：
        ///    
        ///         {
        ///             "MaxScore": int,
        ///             "AverageScore": int,
        ///             "ScoreBandCount":
        ///             {
        ///                 "HigherThan90": int,
        ///                 "HigherThan75": int,
        ///                 "HigherThan60": int,
        ///                 "Failed": int
        ///             }
        ///         }
        ///     
        /// 其中departmentID在后端为枚举类型 enum Department{  建筑 = 010, 计算机 = 090}  内容后续会补充
        /// </remarks>
        /// <returns>全校分数概况</returns>
        /// <response code="200">返回全校分数概况</response>
        [HttpGet("scores/summary")]
        [ProducesResponseType(typeof(ScoreSummaryViewModel), 200)]
        public async Task<IActionResult> ScoreSummaryOfSchool()
        {
            // TODO: Score Summary放入缓存
            var model = new ScoreSummaryViewModel
            {
                MaxScore = await unitOfWork.StudentRepository.HighestScore(),
                AverageScore = await unitOfWork.StudentRepository.AverageScore(),
                ScoreBandCount =
                {
                    HigherThan90 = await unitOfWork.StudentRepository.ScoreHigherThan(90),
                    HigherThan75 = await unitOfWork.StudentRepository.ScoreHigherThan(75),
                    HigherThan60 = await unitOfWork.StudentRepository.ScoreHigherThan(60)
                }
            };
            model.ScoreBandCount.Failed = await unitOfWork.StudentRepository.SizeAsync() - model.ScoreBandCount.HigherThan60;
            return Json(model);
        }

        /// <summary>
        /// 按照院系ID获取概况
        /// </summary>
        /// <remarks>
        ///    院系分数概况JSON格式如下：
        ///    
        ///     {
        ///         "departmentID": int,
        ///         "CounselorName": string,
        ///         "MaxScore": int,
        ///         "AverageScore": int,
        ///         "ScoreBandCount":
        ///         {
        ///             "HigherThan90": int,
        ///             "HigherThan75": int,
        ///             "HigherThan60": int,
        ///             "Failed": int
        ///         }
        ///     }
        ///     
        ///     
        ///     
        /// 其中departmentID在后端为枚举类型 enum Department{  建筑 = 010, 计算机 = 090}  内容后续会补充
        /// </remarks>
        /// <returns>id对应院系分数概况</returns>
        /// <response code="200">返回id对应院系分数概况</response>
        /// <response code="404">id对应院系不存在</response>
        [HttpGet("scores/summary/{id}")]
        [ProducesResponseType(typeof(ScoreSummaryViewModel), 200)]
        public async Task<IActionResult> ScoreSummaryByDepartment(Department id)
        {
            var counselor = await unitOfWork.CounselorRepository.FirstOrDefaultAsync(c => c.Department == id);
            if (counselor == null)
            {
                return NotFound();
            }

            // TODO: Score Summary放入缓存
            var model = new ScoreSummaryViewModel
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
            return Json(model);
        }
    }
}