using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using HistoryContest.Server.Models.Entities;

namespace HistoryContest.Server.Models.ViewModels
{
    public class StudentViewModel
    {
        [Required]
        public int StudentID { get; set; }
        [Required]
        public int CardID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public bool IsCompleted { get; set; }
        public int? Score { get; set; }

        public static explicit operator StudentViewModel(Student student)
        {
            return new StudentViewModel
            {
                StudentID = student.ID,
                CardID = student.CardID,
                Name = student.Name,
                IsCompleted = student.IsTested,
                Score = student.Score
            };
        }
    }
}
