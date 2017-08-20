using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Models.ViewModels
{
    public class SubmittedAnswerViewModel
    {
        [Required]
        public int ID { get; set; }
        [Required]
        public int Answer { get; set; }
    }

    public class CorrectAnswerViewModel
    {
        public int ID { get; set; }
        public int Answer { get; set; }
        public int Points { get; set; }
    }
}
