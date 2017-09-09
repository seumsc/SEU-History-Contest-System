using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HistoryContest.Server.Data;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;
using HistoryContest.Server.Extensions;
using HistoryContest.Server.Services;

namespace HistoryContest.Server.Controllers.APIs
{
    [Authorize(Roles = "Student, Administrator")]
    [ValidateAntiForgeryToken]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class StudentController : Controller
    {
        private readonly UnitOfWork unitOfWork;
        private readonly QuestionSeedService questionSeedService;

        public StudentController(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            questionSeedService = new QuestionSeedService(unitOfWork);
        }

        #region State APIs
        /// <summary>
        /// 获取学生状态
        /// </summary>
        /// <remarks>
        /// 目前用来检查学生考试状态，以及问题种子是否已正确设置。**注意这个API暂不检查学生ID是否存在于Session中。**
        /// 
        /// 学生的考试状态有三种，用一个枚举表示，即：
        /// `enum TestState { NotTested = 0, Testing = 1, Tested = 2 }`
        /// 
        /// 可以根据不同的状态将网页重定向到不同的位置。
        /// </remarks>
        /// <returns>学生状态</returns>
        /// <response code="200">返回学生的考试状态，以及问题种子是否设置</response>
        /// <response code=""></response>
        [HttpGet("State")]
        [ProducesResponseType(typeof(StudentStateViewModel), StatusCodes.Status200OK)]
        public IActionResult State()
        {
            return Json(new StudentStateViewModel
            {
                TestState = this.Session().TestState,
                IsSeedSet = this.Session().TestState == TestState.Tested ? true : this.Session().SeedID != null
            });
        }

        /// <summary>
        /// 初始化考试状态
        /// </summary>
        /// <remarks>
        /// 学生开始考试前，设置相关考试状态，即：
        /// * 设置问题种子
        /// * 设置考试开始时间
        /// </remarks>
        /// <returns>当前学生考试开始时间</returns>
        /// <response code="201">返回设置的当前学生考试开始时间</response>
        /// <response code="302">已经初始化则重定向到`GET State`方法</response>
        [HttpPost("State/[action]")]
        [ProducesResponseType(typeof(DateTime), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status302Found)]
        public async Task<IActionResult> Initialize()
        {
            if (this.Session().TestBeginTime != null || this.Session().TestState != TestState.NotTested)
            { // 已经初始化或考完试则重定向到State方法
                return RedirectToAction(nameof(State));
            }

            this.Session().TestState = TestState.Testing;
            await SetSeed();
            return SetStartTime();
        }

        /// <summary>
        /// 重设学生考试状态
        /// </summary>
        /// <remarks>
        /// 当学生因特殊情况重进网页，需要重新考试时，重新设置学生的考试状态。
        /// </remarks>
        /// <returns></returns>
        /// <response code=""></response>
        [HttpPost("State/[action]")]
        public async Task<IActionResult> Reset()
        {
            if (this.Session().TestBeginTime == null || this.Session().TestState != TestState.Testing)
            { // 未初始化或已考试则重定向到State方法
                return RedirectToAction(nameof(State));
            }

            ClearSeed();
            ClearStartTime();
            await SetSeed();
            return SetStartTime();
        }
        #endregion

        #region Seed APIs
        /// <summary>
        /// 设置一个问题种子
        /// </summary>
        /// <remarks>
        /// 在问题种子池中随机出一个种子ID，将其保存在当前用户的Session中。
        /// </remarks>
        /// <returns>问题种子ID</returns>
        /// <response code="201">返回问题种子的ID</response>
        /// <response code="204">问题种子已经设置</response>
        [HttpPost("Seed")]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> SetSeed()
        {
            if (this.Session().TestState == TestState.Tested)
            { // 已经考完试则重定向到State方法
                return RedirectToAction(nameof(State));
            }
            if (this.Session().SeedID == null)
            {
                var seed = await questionSeedService.RollSeed();
                this.Session().SeedID = seed.ID;
                return CreatedAtAction(nameof(QuestionController.GetQuestionIDSet), nameof(QuestionController), null, seed.ID);
            }
            return NoContent();
        }

        /// <summary>
        /// 清除当前问题种子
        /// </summary>
        /// <remarks>
        /// 清除Session当前seed
        /// </remarks>
        /// <response code="204"></response>
        [HttpDelete("Seed")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult ClearSeed()
        {
            this.Session().SeedID = null;
            return NoContent();
        }
        #endregion

        #region Time APIs
        /// <summary>
        /// 返回剩余考试时间
        /// </summary>
        /// <remarks>
        /// 以30分钟为基准，通过当前时间与Session中考试开始时间之差计算出当前学生剩余考试时间。
        /// 
        /// 返回的字符串格式样例：
        /// 
        ///     "00:29:34.2049107"
        /// 
        /// </remarks>
        /// <returns>剩余考试时间</returns>
        /// <response code="200">返回剩余的考试时间</response>
        /// <response code="204">当前学生尚未开始考试</response>
        [HttpGet("Time")]
        [ProducesResponseType(typeof(TimeSpan), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult GetLeftTime()
        {
            if (this.Session().TestState == TestState.Tested)
            { // 已经考完试则重定向到State方法
                return RedirectToAction(nameof(State));
            }
            if (this.Session().TestBeginTime == null)
            {
                return NoContent();
            }
            TimeSpan timeLeft = unitOfWork.Configuration.TestTime - (DateTime.Now - (DateTime)this.Session().TestBeginTime);
            return Json(timeLeft);
        }

        /// <summary>
        /// 设置考试开始时间
        /// </summary>
        /// <remarks>
        /// 将当前日期时间存储在Session中，作为考试开始时间。
        /// 
        /// 返回的字符串格式样例：
        /// 
        ///     "2017-08-15T23:42:02.2776927+08:00"
        /// 
        /// </remarks>
        /// <returns>当前学生考试开始时间</returns>
        /// <response code="201">返回设置的当前学生考试开始时间</response>
        /// <response code="302">学生已开始考试，重定向到同一地址的`GET`</response>
        [HttpPost("Time")]
        [ProducesResponseType(typeof(DateTime), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status302Found)]
        public IActionResult SetStartTime()
        {
            if (this.Session().TestState == TestState.Tested)
            { // 已经考完试则重定向到State方法
                return RedirectToAction(nameof(State));
            }
            if (this.Session().TestBeginTime == null)
            {
                DateTime now = DateTime.Now;
                this.Session().TestBeginTime = now;
                return CreatedAtAction(nameof(GetLeftTime), now);
            }
            return RedirectToAction(nameof(GetLeftTime));
        }

        /// <summary>
        /// 清除考试开始时间
        /// </summary>
        /// <remarks>
        /// 清空当前学生Session中考试开始时间的记录。
        /// </remarks>
        /// <response code="204"></response>
        [HttpDelete("Time")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult ClearStartTime()
        {
            this.Session().TestBeginTime = null;
            return NoContent();
        }
        #endregion Time APIs
    }
}
