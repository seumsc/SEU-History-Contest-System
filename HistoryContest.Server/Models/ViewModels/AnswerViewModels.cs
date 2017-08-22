using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Models.ViewModels
{
    public class SubmittedAnswerViewModel
    {
        [Required]
        [DefaultValue(16)]
        public int ID { get; set; }
        [Required]
        [DefaultValue(0)]
        public int Answer { get; set; }
    }

    public class CorrectAnswerViewModel
    {
        [DefaultValue(16)]
        public int ID { get; set; }
        [DefaultValue(2)]
        public int Answer { get; set; }
        [DefaultValue(4)]
        public int Points { get; set; }
    }
}
