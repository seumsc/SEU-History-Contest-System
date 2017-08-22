using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HistoryContest.Server.Models.Entities;
using System.ComponentModel;

namespace HistoryContest.Server.Models.ViewModels
{
    public class UserViewModel
    {
        [DefaultValue("用户名")]
        public string UserName { get; set; }
        [DefaultValue("姓名")]
        public string RealName { get; set; }
        [DefaultValue("身份")]
        public string Role { get; set; }
    }
}
