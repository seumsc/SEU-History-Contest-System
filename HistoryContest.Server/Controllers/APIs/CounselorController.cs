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
using HistoryContest.Server.Services;
using HistoryContest.Server.Extensions;

namespace HistoryContest.Server.Controllers.APIs
{
    [Authorize(Roles = "Counselor, Administrator")]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class CounselorController : Controller
    {
        private readonly UnitOfWork unitOfWork;
        private readonly ExcelExportService excelExportService;

        public CounselorController(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            excelExportService = new ExcelExportService(unitOfWork);
            unitOfWork.StudentRepository.LoadStudentsFromCounselors();
        }

        /// <summary>
        /// 创建或更新当前辅导员所在院系所有学生分数情况的EXCEL表
        /// </summary>
        /// <remarks>
        /// 无需参数，通过Session中department获取院系id
        /// * excel统计表将在wwwroot/excel/ 目录下创建或更新以院系id为名的xlsx文件
        /// * 下载功能在Download中实现
        /// 
        /// excel中的统计信息包括:
        /// 1. 学号
        /// 2. 一卡通号
        /// 3. 姓名
        /// 4. 是否完成
        /// 5. 得分
        /// </remarks>
        /// <returns>院系学生:学号\一卡通号\姓名\是否完成\得分的excel表名称</returns>
        /// <response code="200">返回本院系得分EXCEL统计表名</response>
        /// <response code="400">当前用户不是辅导员或对应Session中没有department</response>
        [HttpPost("ExportExcelofDepartment")]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ExportExcelofDepartment()
        {
            if (!(HttpContext.User.IsInRole("Counselor") && HttpContext.Session.Get("department") != null))
            { // 当前用户认证为辅导员，则取Session中的department为院系id
                return BadRequest("Empty argument request invalid");
            }
            var id = (Department)HttpContext.Session.GetInt32("department");
            string sWebRootFolder = Startup.Environment.WebRootPath;
            string sFileName = @"excel/"+id.ToString()+".xlsx";
            
            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            if (file.Exists)
            {
                file.Delete();
            }
            await excelExportService.CreateExcelByDepartmentid(file,id);
            return Json(id.ToString() + ".xlsx");
        }

        /// <summary>
        /// 创建或更新全校各个院系分数概况的EXCEL表
        /// </summary>
        /// <remarks>
        /// 无需参数
        /// * excel统计表将在wwwroot/excel/ 目录下创建或更新 ScoreSummaryOfAllDepartments.xlsx
        /// * 下载功能在Download中实现
        /// 
        /// excel中的统计信息包括:
        /// 1. 院系ID
        /// 2. 辅导员姓名
        /// 3. 最高分
        /// 4. 平均分
        /// 5. 分数段对应人数
        ///     - >=90 , >=75 , >=60 , 小于60
        /// </remarks>
        /// <returns>全校各院系分数概况excel表名称</returns>
        /// <response code="200">返回各院系得分概况EXCEL统计表名</response>
        /// <response code="400">当前用户不是辅导员或对应Session中没有department</response>
        [HttpPost("ExportExcelOfAllDepartments")]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ExportExcelOfAllDepartments()
        {
            if (!(HttpContext.User.IsInRole("Counselor") && HttpContext.Session.Get("department") != null))
            { // 当前用户认证为辅导员，则取Session中的department为院系id
                return BadRequest("Empty argument request invalid");
            }
            
            string sWebRootFolder = Startup.Environment.WebRootPath;
            string sFileName = @"excel/" + "ScoreSummaryOfAllDepartments.xlsx";

            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            if (file.Exists)
            {
                file.Delete();
            }
            await excelExportService.CreateExcelOfAllDepartments(file);
            return Json("ScoreSummaryOfAllDepartments.xlsx");
        }

        /// <summary>
        /// 提供下载功能
        /// </summary>
        /// <remarks>
        /// 参数为 excel文件名 --.xlsx
        /// * 在创建或者更新excel文件后获得文件名
        /// * 通过  window.location = '/Counselor/Download?file=' + returnValue;下载
        /// </remarks>
        /// <returns>excel文件</returns>
        /// <response code="200">下载文件</response>
        [HttpGet]
        public virtual ActionResult Download(string file)
        {
            string sWebRootFolder = Startup.Environment.WebRootPath;
            sWebRootFolder += @"/excel";
            string fullPath = Path.Combine(sWebRootFolder, file);
            return File(fullPath, "application/vnd.ms-excel", file);
        }

        /// <summary>
        /// 获取辅导员所在院系
        /// </summary>
        /// <remarks>
        /// 返回Session中存储的院系代号。
        /// </remarks>
        /// <returns>辅导员对应院系代号</returns>
        /// <response code="200">返回辅导员所在的院系代号</response>
        /// <response code="404">Session中未设置院系代号</response>
        [HttpGet("Department")]
        [ProducesResponseType(typeof(Department), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetDepartment()
        {
            var id = HttpContext.Session.GetInt32("department");
            if (id == null)
            {
                return NotFound();
            }
            return Json((Department)id);
        }

        /// <summary>
        /// 获取一个院系所有学生的学号
        /// </summary>
        /// <remarks>
        /// 这个API将辅导员对应的所有学生的学号返回，让前端根据学号一个个地检索学生信息。可能在异步加载上有所帮助。
        /// 
        /// ID参数是可选的。如果不输入ID，且当前用户认证为辅导员，则取Session中的院系代码作为ID。
        /// </remarks>
        /// <param name="id">院系代号枚举数（可选）</param>
        /// <returns>院系所有学生学号</returns>
        /// <response code="200">返回辅导员对应的所有学生学号构成的数组</response>
        /// <response code="400">当前用户不是辅导员或对应Session中没有院系代码</response>
        /// <response code="403">辅导员查询非本系数据</response>
        /// <response code="404">ID不属于任何一个院系代号</response>
        [HttpGet("AllStudents/{id?}")]
        [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AllStudentIDs(Department? id)
        {
            if (id == null)
            { // 如果不输入ID，且当前用户认证为辅导员，则取Session中的院系代码作为ID
                if (HttpContext.User.IsInRole("Counselor") && HttpContext.Session.Get("department") != null)
                {
                    id = (Department)HttpContext.Session.GetInt32("department");
                }
                else
                {
                    return BadRequest("Empty argument request invalid");
                }
            }

            if (!HttpContext.User.IsInRole("Administrator") && id != (Department)HttpContext.Session.GetInt32("department"))
            { // 不允许辅导员查询不同系学生的数据
                return Forbid();
            }

            //TODO : <yhy>将院系学生信息存入缓存中 1
            var students = (await unitOfWork.StudentRepository.GetByDepartment((Department)id));
            if (students == null)
            {
                return NotFound();
            }

            return Json(students.AsQueryable().Select(s => s.ID.ToStringID()));
        }

        #region Scores APIs
        /// <summary>
        /// 获取一个院系所有学生的简要得分信息
        /// </summary>
        /// <remarks>
        /// ID参数是可选的。如果不输入ID，且当前用户认证为辅导员，则取Session中的院系代码作为ID。
        /// </remarks>
        /// <param name="id">院系代号枚举数（可选）</param>
        /// <returns>院系所有学生得分</returns>
        /// <response code="200">返回本院系所有学生简要得分信息</response>
        /// <response code="400">当前用户不是辅导员或对应Session中没有院系代码</response>
        /// <response code="403">辅导员查询非本系数据</response>
        /// <response code="404">ID不属于任何一个院系代号</response>
        [HttpGet("Scores/All/{id?}")]
        [ProducesResponseType(typeof(IEnumerable<StudentViewModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AllScoresByDepartment(Department? id)
        {
            if (id == null)
            { // 如果不输入ID，且当前用户认证为辅导员，则取Session中的院系代码作为ID
                if (HttpContext.User.IsInRole("Counselor") && HttpContext.Session.Get("department") != null)
                {
                    id = (Department)HttpContext.Session.GetInt32("department");
                }
                else
                {
                    return BadRequest("Empty argument request invalid");
                }
            }

            if (!HttpContext.User.IsInRole("Administrator") && id != (Department)HttpContext.Session.GetInt32("department"))
            { // 不允许辅导员查询不同系学生的数据
                return Forbid();
            }

            //TODO : <yhy>将院系学生信息存入缓存中 2
            var students = (await unitOfWork.StudentRepository.GetByDepartment((Department)id));
            if (students == null)
            {
                return NotFound();
            }

            return Json(students.AsQueryable().Select(s => (StudentViewModel)s));
        }

        /// <summary>
        /// 获取一个学生的简要得分信息
        /// </summary>
        /// <remarks>
        /// 这个API主要是配合 `POST api/Counselor/AllStudents/{id}` 使用，使前端能够先获得学号，然后根据学号分批分次地加载学生信息。
        /// </remarks>
        /// <returns>学生简要得分信息</returns>
        /// <param name="id">学生的学号</param>
        /// <response code="200">返回学号对应学生的得分信息</response>
        /// <response code="403">辅导员查询非本系学生的数据</response>
        /// <response code="404">ID没有对应的学生</response>
        [HttpGet("Scores/Single/{id}")]
        [ProducesResponseType(typeof(StudentViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> StudentScoreById(string id)
        {
            var student = await unitOfWork.StudentRepository.GetByIDAsync(id.ToIntID());
            if (student == null)
            {
                return NotFound();
            }

            if (!HttpContext.User.IsInRole("Administrator") && student.CounselorID != HttpContext.Session.GetString("id").ToIntID())
            { // 不允许辅导员查询不同系学生的数据
                return Forbid();
            }

            return Json((StudentViewModel)student);
        }
        #endregion

        #region Score Summary APIs
        /// <summary>
        /// 获取全校分数概况
        /// </summary>
        /// <remarks>
        /// **NOTE:这个功能目前尚未被正确实现，仅用于参考JSON返回值**
        /// </remarks>
        /// <returns>全校分数概况</returns>
        /// <response code="200">
        /// 返回全校的分数概况及学生完成情况
        /// * 这个内容并不是每次请求时新计算而得的，而是每隔一段时间（如10分钟）自动更新一次
        /// * 因此，JSON文件里面有一个“更新时间”的记录。
        /// </response>
        [HttpGet("Scores/Summary")]
        [ProducesResponseType(typeof(ScoreSummaryOfSchoolViewModel), StatusCodes.Status200OK)]
        public async Task<IActionResult> ScoreSummaryOfSchool()
        {
            return Json(await ScoreSummaryOfSchoolViewModel.CreateAsync(unitOfWork));
        }

        /// <summary>
        /// 获取一个院系的分数概况
        /// </summary>
        /// <remarks>
        /// 院系代号在后端为一个枚举，目前内容如下：
        ///     
        ///     enum Department
        ///     {
        ///         建筑 = 0x010,
        ///         计算机 = 0x090
        ///     }
        /// 
        /// 前端也可建立一个相同的枚举表，这样便可不用在意每个枚举值中所存数据。
        /// 
        /// ID参数是可选的。如果不输入ID，且当前用户认证为辅导员，则取Session中的院系代码作为ID。
        /// </remarks>
        /// <param name="id">院系代号枚举数（可选）</param>
        /// <returns>ID对应院系的分数概况</returns>
        /// <response code="200">返回院系代码对应院系的分数概况</response>
        /// <response code="400">当前用户不是辅导员或对应Session中没有院系代码</response>
        /// <response code="404">ID没有对应的院系</response>
        [HttpGet("Scores/Summary/{id?}")]
        [ProducesResponseType(typeof(ScoreSummaryByDepartmentViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ScoreSummaryByDepartment(Department? id)
        {
            if (id == null)
            { // 如果不输入ID，且当前用户认证为辅导员，则取Session中的院系代码作为ID
                if (HttpContext.User.IsInRole("Counselor") && HttpContext.Session.Get("department") != null)
                {
                    id = (Department)HttpContext.Session.GetInt32("department");
                }
                else
                {
                    return BadRequest("Empty argument request invalid");
                }
            }

            var counselor = await unitOfWork.CounselorRepository.FirstOrDefaultAsync(c => c.Department == id);
            if (counselor == null)
            {
                return NotFound();
            }

            return Json(await ScoreSummaryByDepartmentViewModel.CreateAsync(unitOfWork, counselor));
        }
        #endregion
    }
}
