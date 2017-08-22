using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Models.ViewModels
{
    public class LoginViewModel
    {
        [Required]
        [DefaultValue("09016319")]
        public string UserName { get; set; }
        [Required]
        [DefaultValue("username")]
        public string Password { get; set; }
    }
}
