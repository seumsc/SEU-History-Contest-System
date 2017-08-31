using HistoryContest.Server.Models.Entities;
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

        public static explicit operator CorrectAnswerViewModel(AQuestionBase question)
            => new CorrectAnswerViewModel { ID = question.ID, Answer = question.Answer, Points = question.Points };
    }
}
