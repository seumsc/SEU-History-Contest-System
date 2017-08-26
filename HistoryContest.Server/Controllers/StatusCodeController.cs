using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.Logging;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HistoryContest.Server.Controllers
{
    public class StatusCodeController : Controller
    {
        private readonly ILogger<HomeController> logger;
        public StatusCodeController(ILogger<HomeController> logger)
        {
            this.logger = logger;
        }

        [HttpGet("/StatusCode/{statusCode}")]
        public IActionResult Index(int statusCode)
        {
            var reExecute = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
            logger.LogInformation($"Unexpected Status Code: {statusCode}, OriginalPath: {reExecute.OriginalPath}");
            return View(statusCode);
        }
    }
}
