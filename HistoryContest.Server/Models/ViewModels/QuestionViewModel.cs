using HistoryContest.Server.Models.Entities;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace HistoryContest.Server.Models.ViewModels
{
    public enum QuestionType
    {
        Choice,
        TrueFalse
    }

    public class QuestionViewModel
    {
        [Required]
        [DefaultValue(16)]
        public int ID { get; set; }
        [Required]
        [DefaultValue(QuestionType.Choice)]
        public QuestionType Type { get; set; }
        [Required]
        [DefaultValue("在高等师范学校的基础上东南大学在哪年成立？")]
        public string Question { get; set; }
        [DefaultValue(new string[] { "1919", "1920", "1921", "1922" })]
        public string[] Choices { get; set; } // string本身为nullable类型，故不用加上"?"

        public static explicit operator QuestionViewModel(AQuestionBase question)
        { // 类型转换操作符
            var type = GetQuestionType(question);
            return new QuestionViewModel
            {
                ID = question.ID,
                Question = question.Question,
                Type = type,
                Choices = type == QuestionType.Choice ? ((ChoiceQuestion)question).AllChoices : null
            };
        }

        public static QuestionType GetQuestionType(AQuestionBase question)
        {
            var type = question.GetType();
            if (type == typeof(ChoiceQuestion))
            {
                return QuestionType.Choice;
            }
            else if (type == typeof(TrueFalseQuestion))
            {
                return QuestionType.TrueFalse;
            }
            else
            {
                throw new TypeLoadException("Question type invalid");
            }
        }
    }
}
