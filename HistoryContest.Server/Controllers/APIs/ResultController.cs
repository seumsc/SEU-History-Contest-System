using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HistoryContest.Server.Data;
using HistoryContest.Server.Services;
using HistoryContest.Server.Extensions;
using HistoryContest.Server.Models.ViewModels;

namespace HistoryContest.Server.Controllers.APIs
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ResultController : Controller
    {
        private readonly UnitOfWork unitOfWork;
        private readonly QuestionSeedService questionSeedService;

        public ResultController(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            questionSeedService = new QuestionSeedService(unitOfWork);
        }

        /// <summary>
        /// 获取答题细节
        /// </summary>
        /// <remarks>
        ///    返回总分，完成的结束时间，完成用时和得分的细节
        ///    参数为学生id
        ///    提供给前端在学生查分或者刚交卷查分时使用
        /// </remarks>
        /// <returns>当前登录id（没有id身份认证为学生或自动获取id）的答题细节</returns>
        /// <response code="200">返回当前id(用户)对应的答题细节</response>
        /// <response code="400">当前id(用户)不存在或尚未完成答题</response>
        [HttpGet("{id?}")]
        [ProducesResponseType(typeof(ResultViewModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetResult(int? id)
        {
            if (id == null && HttpContext.User.IsInRole("Student") && HttpContext.Session.Get("id") != null)
            { // 如果不输入id，且当前用户认证为学生，则取Session中的学号作为id
                id = int.Parse(HttpContext.Session.GetString("id"));
            }
            else
            {
                return BadRequest("Empty argument request invalid");
            }

            var student = await unitOfWork.StudentRepository.GetByIDAsync(id);
            if(student == null)
            {
                return BadRequest("Student not found");
            }
            if (!student.IsTested)
            {
                return BadRequest("Contest hasn't been completed");
            }

            var model = new ResultViewModel();
            // TODO: 将model从缓存中取出（按Ctrl + Alt + K打开TODO列表）
            
            model.Score = (int)student.Score;
            model.Details = student.QuestionSeed.QuestionIDs.Zip(student.Choices, (ID, choice) => new ResultDetailViewModel
            {
                ID = ID,
                RightAnswer = (unitOfWork.QuestionRepository.GetByID(ID)).Answer,
                SubmittedAnswer = choice
            }).ToList();

            return Json(model);
        }



        /// <summary>
        /// 接收答案生成答题细节
        /// </summary>
        /// <remarks>
        ///     传入答案的格式：
        ///     
        ///     [
        ///         {"id": int, "answer": int}
        ///     ]
        ///         
        /// </remarks>
        /// <returns>当前答案对应的答题细节</returns>
        /// <response code="200">返回答案参数对应的答题细节</response>
        /// <response code="400">参数JSON格式不合法</response>
        [HttpPost]
        [ProducesResponseType(typeof(ResultViewModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> CountScore([FromBody]List<SubmittedAnswerViewModel> answers)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest("Body JSON content invalid");
            }

            var student = await unitOfWork.StudentRepository.GetByIDAsync(int.Parse(HttpContext.Session.GetString("id")));
            student.Score = 0;
            student.DateTimeFinished = DateTime.Now;
            student.TimeConsumed = student.DateTimeFinished - HttpContext.Session.Get<DateTime>("begintime");
            student.Choices = answers.Select(a => (byte)a.Answer).ToArray();

            var model = new ResultViewModel
            {
                Details = new List<ResultDetailViewModel>(capacity: 30),
                TimeFinished = (DateTime)student.DateTimeFinished,
                TimeConsumed = (TimeSpan)student.TimeConsumed
            };
            foreach(var a in answers)
            {
                var item = await unitOfWork.QuestionRepository.GetByIDAsync(a.ID);
                if (item == null)
                {
                    return BadRequest("Encounter invalid ID in answer set: " + a.ID);
                }
                student.Score += a.Answer == item.Answer ? item.Points : 0;
                model.Details.Add(new ResultDetailViewModel { ID = item.ID, RightAnswer = item.Answer, SubmittedAnswer = a.Answer });
            }
            model.Score = (int)student.Score;

            // TODO: 将model存到缓存
            unitOfWork.StudentRepository.Update(student);
            await unitOfWork.SaveAsync();
            return Json(model);
        }

        /// <summary>
        /// 获取问题集的所有正确答案
        /// </summary>
        /// <remarks>
        ///    当前用户对应的问题seed的返回正确答案的JSON格式为：
        ///    
        ///     [
        ///         {
        ///             "id": int,
        ///             "answer": int,
        ///             "points": int
        ///         }
        ///     ]
        ///     
        /// </remarks>
        /// <returns>当前问题种子的答案序列</returns>
        /// <response code="200">返回seed对应的答案序列</response>
        /// <response code="400">seed尚未创建</response>
        [HttpGet("answer")]
        [ProducesResponseType(typeof(List<CorrectAnswerViewModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetAllAnswers()
        {
            var seed = HttpContext.Session.GetInt32("seed");
            if (seed == null)
            {
                return BadRequest("Question seed not created");
            }

            var source = await questionSeedService.GetQuestionsBySeedID((int)seed);
            if (source == null)
            {
                // TODO: 详细定义异常
                throw new Exception("Improper seed created, ID: " + seed);
            }

            return Json(source.Select(q => new CorrectAnswerViewModel { ID = q.ID, Answer = q.Answer, Points = q.Points }));
        }

        /// <summary>
        /// 获取id对应问题的正确答案
        /// </summary>
        /// <remarks>
        ///    当前id对应问题答案的JSON格式为：
        ///    
        ///     {
        ///         "id": int,
        ///         "answer": int,
        ///         "points": int
        ///     }
        ///    
        /// </remarks>
        /// <returns>当前id对应问题的答案</returns>
        /// <response code="200">返id对应的答案</response>
        /// <response code="404">id对应的问题不存在</response>
        [HttpGet("answer/{id}")]
        [ProducesResponseType(typeof(CorrectAnswerViewModel), 200)]
        public async Task<IActionResult> GetAnswerByID(int id)
        {
            var item = await unitOfWork.QuestionRepository.GetByIDAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            return Json(new CorrectAnswerViewModel { ID = item.ID, Answer = item.Answer, Points = item.Points });
        }
    }
}