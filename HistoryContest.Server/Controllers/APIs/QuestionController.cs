using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;
using HistoryContest.Server.Data;
using HistoryContest.Server.Services;
using HistoryContest.Server.Extensions;

namespace HistoryContest.Server.Controllers.APIs
{
    [Authorize(Roles = "Student, Administrator")]
    [AutoValidateAntiforgeryToken]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class QuestionController : Controller
    {
        private readonly UnitOfWork unitOfWork;
        private readonly QuestionSeedService questionSeedService;

        public QuestionController(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            questionSeedService = new QuestionSeedService(unitOfWork);
        }

        /// <summary>
        /// 获取一套试卷
        /// </summary>
        /// <remarks>
        /// 一套试卷由一个问题数组表示。问题对象有两种，它们对应的JSON格式如下：
        ///  
        ///     选择题：
        ///     {
        ///        "ID": "16",
        ///        "type": 0,
        ///        "question": "在高等师范学校的基础上东南大学在哪年成立？",
        ///        "choices": ["1919", "1920", "1921", "1922"]
        ///     }
        ///     
        ///     判断题：
        ///     {
        ///        "ID": "189",
        ///        "type": 1,
        ///        "question": "齐康被尊为与梁思成齐名的南派建筑学宗师。",
        ///        "choices": null
        ///     }
        ///     
        /// 问题的"type"成员在后端用一个枚举类型表示，即 `enum QuestionType { Choice = 0, TrueFalse = 1 }` 。如有必要，前端也可建一个相同的枚举。
        /// </remarks>
        /// <returns>种子对应的所有问题</returns>
        /// <response code="200">返回当前用户Session中存储的种子对应的所有问题构成的数组</response>
        /// <response code="400">当前用户没有对应的问题种子</response>
        /// <response code="403">考生已考完</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<QuestionViewModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetQuestionSet()
        {
            if (this.Session().IsTested)
            {
                return Forbid();
            }

            var seed = this.Session().SeedID;
            if (seed == null)
            {
                return BadRequest("Question seed not created");
            }
            
            var questions = await questionSeedService.GetQuestionsBySeedID((int)seed);
            if (questions == null)
            {
                throw new Exception("Improper seed created, ID: " + seed);
            }

            return Json(questions);
        }

        /// <summary>
        /// 获取一道题
        /// </summary>
        /// <remarks>
        /// 这个API主要是配合 `POST api/Question` 使用，使前端能够先只获得题号，然后根据题号分批分次地抽出问题。
        /// </remarks>
        /// <param name="id">问题对应的唯一ID</param>
        /// <returns>ID对应的问题</returns>
        /// <response code="200">返回由ID所唯一标识的问题</response>
        /// <response code="403">考生已考完</response>
        /// <response code="404">ID没有对应的问题</response>
        [HttpGet("{id}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(QuestionViewModel), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetQuestionById(int id)
        {
            var question = await unitOfWork.QuestionRepository.GetQuestionFromCacheAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            return Json(question);
        }

        /// <summary>
        /// 获取一套试卷的所有问题的题号
        /// </summary>
        /// <remarks>
        /// 这个API将问题种子中存的题号数组返回，让前端根据题号一道道地检索问题。可能在异步加载试卷上有所帮助。
        /// </remarks>
        /// <returns>种子存储的所有问题题号</returns>
        /// <response code="200">返回当前用户Session中存储的种子中的所有题号构成的数组</response>
        /// <response code="400">当前用户没有对应的问题种子</response>
        /// <response code="403">考生已考完</response>
        [HttpPost]
        [ProducesResponseType(typeof(IEnumerable<int>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetQuestionIDSet()
        {
            if (this.Session().IsTested)
            {
                return Forbid();
            }

            var seed = this.Session().SeedID;
            if (seed == null)
            {
                return BadRequest("Question seed not created");
            }

            // TODO: seed加载到内存
            return Json((await unitOfWork.QuestionSeedRepository.GetByIDAsync(seed)).QuestionIDs);
        }
    }
}