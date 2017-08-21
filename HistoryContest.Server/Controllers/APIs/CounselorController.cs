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

namespace HistoryContest.Server.Controllers.APIs
{
    [Authorize(Roles = "Counselor, Administrator")]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class CounselorController : Controller
    {
        private readonly UnitOfWork unitOfWork;

        public CounselorController(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            unitOfWork.StudentRepository.LoadStudentsFromCounselors();
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
        ///             "departmentID": int,
        ///             "CounselorName": string,
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