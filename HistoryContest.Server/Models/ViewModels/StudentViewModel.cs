using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Extensions;

namespace HistoryContest.Server.Models.ViewModels
{
    public class StudentViewModel
    {
        [Required]
        public string StudentID { get; set; }
        [Required]
        public string CardID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public bool IsCompleted { get; set; }
        public int? Score { get; set; }

        public static explicit operator StudentViewModel(Student student)
        {
            return new StudentViewModel
            {
                StudentID = student.ID.ToStringID(),
                CardID = student.CardID.ToString(),
                Name = student.Name,
                IsCompleted = student.IsTested,
                Score = student.Score
            };
        }
    }
}
