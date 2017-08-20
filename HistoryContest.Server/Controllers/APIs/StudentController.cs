using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HistoryContest.Server.Data;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Extensions;
using HistoryContest.Server.Services;

namespace HistoryContest.Server.Controllers.APIs
{
    [Authorize(Roles = "Student, Administrator")]
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
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <returns></returns>
        /// <response code=""></response>
        /// <response code=""></response>
        [HttpGet("state")]
        public IActionResult State()
        { // TODO: 写student的state
            return Json(true);
        }

        /// <summary>
        /// 初始化student状态
        /// </summary>
        /// <remarks>
        ///   已经初始化则重定向到State
        ///   否则先后 SetSeed  SetStartTime
        /// </remarks>
        /// <returns></returns>
        /// <response code=""></response>
        [HttpGet("state/[action]")]
        public async Task<IActionResult> Initialize()
        {
            if (HttpContext.Session.Get("begintime") != null)
            { // 已经初始化则重定向到State方法
                return RedirectToAction(nameof(State));
            }

            await SetSeed();
            return SetStartTime();
        }

        /// <summary>
        /// 重新初始化student状态
        /// </summary>
        /// <remarks>
        ///    未初始化则重定向到State方法
        ///    已初始化则先 ClearSeed ClearStartTime
        ///             后 SetSeed SetStartTime
        /// </remarks>
        /// <returns></returns>
        /// <response code=""></response>
        [HttpPost("state/[action]")]
        public async Task<IActionResult> Reset()
        {
            if (HttpContext.Session.Get("begintime") == null)
            { // 未初始化则重定向到State方法
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
        /// 生成Seesion中seed
        /// </summary>
        /// <remarks>
        ///    Session中未生成seed时生成seed
        /// </remarks>
        /// <returns>种子ID</returns>
        /// <response code="200">返回种子ID</response>
        [HttpPost("seed")]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<JsonResult> SetSeed()
        {
            if (HttpContext.Session.GetInt32("seed") == null)
            {
                var seed = await questionSeedService.RollSeed();
                HttpContext.Session.SetInt32("seed", seed.ID);
                return Json(seed);
            }
            return Json(await unitOfWork.QuestionSeedRepository.GetByIDAsync(HttpContext.Session.GetInt32("seed")));
        }

        /// <summary>
        /// 清除Session当前seed
        /// </summary>
        /// <remarks>
        ///    清除Session当前seed
        /// </remarks>
        /// <returns></returns>
        /// <response code="204">No Content</response>
        [HttpDelete("seed")]
        public IActionResult ClearSeed()
        {
            HttpContext.Session.Remove("seed");
            return NoContent();
        }
        #endregion

        #region Time APIs

        /// <summary>
        /// 返回剩余时间
        /// </summary>
        /// <remarks>
        ///     返回剩余时间
        /// </remarks>
        /// <returns>剩余时间</returns>
        /// <response code="200">返回剩余时间</response>
        [HttpGet("time")]
        [ProducesResponseType(typeof(TimeSpan), 200)]
        public IActionResult GetLeftTime()
        {
            if(HttpContext.Session.Get<DateTime>("begintime") == default(DateTime))
            {
                return NoContent();
            }    
            TimeSpan timeLeft = TimeSpan.FromMinutes(30) - (DateTime.Now - HttpContext.Session.Get<DateTime>("begintime"));
            return Json(timeLeft);
        }

        /// <summary>
        /// 设置初始时间
        /// </summary>
        /// <remarks>
        ///     设置初始时间begintime
        /// </remarks>
        /// <returns></returns>
        /// <response code="200"></response>
        [HttpPost("time")]
        [ProducesResponseType(typeof(DateTime), 200)]
        public IActionResult SetStartTime()
        {
            if(HttpContext.Session.Get<DateTime>("begintime") == default(DateTime))
            {
                DateTime now = DateTime.Now;
                HttpContext.Session.Set<DateTime>("begintime", now);
                return Ok(now);
            }
            return RedirectToAction(nameof(SetStartTime));
        }

        /// <summary>
        /// 清空初始时间
        /// </summary>
        /// <remarks>
        ///     清空初始时间begintime
        /// </remarks>
        /// <returns></returns>
        /// <response code="204">No Content</response>
        [HttpDelete("time")]
        public IActionResult ClearStartTime()
        {
            HttpContext.Session.Remove("begintime");
            return NoContent();
        }
        #endregion Time APIs
    }
}
