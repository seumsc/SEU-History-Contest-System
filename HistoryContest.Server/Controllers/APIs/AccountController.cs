using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using HistoryContest.Server.Data;
using HistoryContest.Server.Services;
using HistoryContest.Server.Extensions;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;
using System.Security.Claims;
using System.Net;

namespace HistoryContest.Server.Controllers.APIs
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UnitOfWork unitOfWork;
        private readonly AccountService accountService;

        public AccountController(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            accountService = new AccountService(unitOfWork);
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <remarks>
        /// 登录成功后，将会根据用户名为用户设置身份，并根据身份为用户初始化各自的Session。
        /// 
        /// 
        /// 用一个布尔值标记登录是否成功
        /// 
        /// 若用户已登录，则布尔值会被标记为false, 并返回用户信息
        /// </remarks>
        /// <param name="model">用户名与密码</param>
        /// <returns>登录结果</returns>
        /// <response code="200">
        /// 返回登录结果。返回JSON格式举例：
        /// 
        ///     验证失败时：
        ///     {
        ///         "isSuccessful": false
        ///         "message": "Validation failed"
        ///     }
        /// 
        ///     验证成功时：
        ///     {
        ///         "isSuccessful": true,
        ///         "userViewModel": {
        ///             "userName": "09016319",
        ///             "realName": "叶志浩",
        ///             "role": "Student"
        ///         }
        ///     }
        ///     
        ///     已经登录时：
        ///     {
        ///         "isSuccessful": false,
        ///         "message": "User already logged in"
        ///         "userViewModel": {
        ///             "userName": "09016319",
        ///             "realName": "叶志浩",
        ///             "role": "Student"
        ///         }
        ///     }
        /// </response>
        [AllowAnonymous]
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(UserViewModel), StatusCodes.Status200OK)]
        public async Task<IActionResult> Login([FromBody]LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Body JSON content invalid");
            }

            if (HttpContext.Session.Get("id") != null)
            {
                var id = HttpContext.Session.GetString("id");
                var name = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "RealName").Value;
                var role = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role).Value;
                var userViewModel = new UserViewModel { UserName = id, RealName = name, Role = role };
                return Json(new { isSuccessful = false, message = "User already logged in", userViewModel });
            }

            var userContext = await accountService.ValidateUser(model.UserName, model.Password);
            if (userContext.UserViewModel != null)
            {
                await InitializeSession(userContext);
                var principal = new ClaimsPrincipal(new ClaimsIdentity(userContext.Claims, accountService.GetType().Name));
#if NETCOREAPP2_0
                await HttpContext.SignInAsync(principal);
#else
                await HttpContext.Authentication.SignInAsync(Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme, principal);
#endif
                return Json(new { isSuccessful = true, userContext.UserViewModel });
            }
            else
            {
                return Json(new { isSuccessful = false, message = "Validation failed" });
            }
        }

        /// <summary>
        /// 注册
        /// </summary>
        /// <remarks>
        /// 用一个布尔值标记登录是否注册成功
        /// 
        /// 后台对注册的信息验证失败时，布尔值返回false
        /// 
        /// 目前，非学生身份注册会直接返回BadRequest。
        /// </remarks>
        /// <param name="model">用户名、密码、真实姓名、身份（默认为Student）</param>
        /// <returns>注册结果</returns>
        /// <response code="200">
        /// 返回注册结果。返回JSON格式举例：
        /// 
        /// 
        ///     验证失败时：
        ///     {
        ///         "isSuccessful": false
        ///         "message" : string
        ///     }
        ///     
        /// 
        /// message分为以下几种：
        /// * 注册信息验证不通过: "Registration validation failed. Please make sure the information provided is correct."
        /// * 用户名已存在: "UserName has already been registered."
        /// * 验证服务器连接失败: "Problem in connecting validation network. Please Try again."
        /// 
        /// 
        ///     验证成功时：
        ///     {
        ///         "isSuccessful": true,
        ///         "userViewModel": {
        ///             "userName": "09016319",
        ///             "realName": "叶志浩",
        ///             "role": "Student"
        ///         }
        ///     }
        ///     
        /// 
        /// </response>
        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Body JSON content invalid");
            }

            if (model.Role != nameof(Student))
            {
                return BadRequest("Student registration only");
            }

            UserViewModel user = null;
            try
            {
                user = await accountService.CreateUser(model);
            }
            catch (ArgumentException ex)
            {
                return Json(new { isSuccessful = false, message = ex.Message });
            }
            catch (WebException ex)
            {
                return Json(new { isSuccessful = false, message = ex.Message + ". Please try again." });
            }
            catch (KeyNotFoundException ex)
            {
                return Json(new { isSuccessful = false, message = "Student data not found. Raw page data: \n" + ex.Message });
            }
            if (user != null)
            {
                return Json(new { isSuccessful = true, user });
            }
            else
            {
                return Json(new { isSuccessful = false, message = "Registration validation failed. Please make sure the information provided is correct." });
            }
        }

        /// <summary>
        /// 注销
        /// </summary>
        /// <remarks>
        /// 登出当前用户，并清除当前用户Session中的所有内容。
        /// </remarks>
        /// <response code="200">成功注销</response>
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return SignOut();
        }

        [NonAction]
        private async Task InitializeSession(AccountContext context)
        {
            this.Session().ID = context.UserViewModel.UserName;
            switch (context.UserViewModel.Role)
            {
                case nameof(Administrator):
                    break;
                case nameof(Counselor):
                    var counselor = (Counselor)context.UserEntity;
                    this.Session().Department = counselor.Department;
                    break;
                case nameof(Student):
                    var id = context.UserEntity.ID.ToStringID();
                    var student = await unitOfWork.Cache.StudentEntities(id.ToDepartmentID()).GetAsync(id);
                    this.Session().IsTested = student.IsTested;
                    break;
                default:
                    throw new TypeLoadException("User role invalid");

            }
        }
    }
}