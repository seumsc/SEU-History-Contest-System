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
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;
using System.Security.Claims;

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
        /// <returns>学号对应的考试结果</returns>
        /// <response code="200">
        /// 返回登录结果。返回JSON格式举例：
        /// 
        ///     验证失败时：
        ///     {
        ///         "isSuccessful": false    
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
                var user = await accountService.GetUser(id);
                var userViewModel = new UserViewModel { UserName = id, RealName = user.Name, Role = user.GetType().Name };
                return Json(new { isSuccessful = false, message = "User already logged in", userViewModel });
            }

            var userContext = await accountService.ValidateUser(model.UserName, model.Password);
            if (userContext.UserViewModel != null)
            {
                InitializeSession(userContext);
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
                return Json(new { isSuccessful = false });
            }
        }

        //[AllowAnonymous]
        //[HttpPost("[action]")]
        //public IActionResult Register(RegistrationViewModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest();
        //    }

        //    UserViewModel user = accountService.CreateUser(model.UserName, model.Password, model.role?? "Student");
        //    if (user != null)
        //    {
        //        return Json(new { isSuccessful = true, user });
        //    }
        //    else
        //    {
        //        return Json(new { isSuccessful = false });
        //    }
        //}

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
        private void InitializeSession(AccountContext context)
        {
            HttpContext.Session.SetString("id", context.UserViewModel.UserName);
            switch (context.UserViewModel.Role)
            {
                case nameof(Administrator):
                    break;
                case nameof(Counselor):
                    var counselor = (Counselor)context.UserEntity;
                    HttpContext.Session.SetInt32("department", (int)counselor.Department);
                    break;
                case nameof(Student):
                    var student = (Student)context.UserEntity;
                    HttpContext.Session.SetInt32("isTested", student.IsTested ? 1 : 0);
                    break;
                default:
                    throw new TypeLoadException("User role invalid");

            }
        }
    }
}