using HistoryContest.Server.Data;
using HistoryContest.Server.Models;
using HistoryContest.Server.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;

namespace HistoryContest.Server.Services
{
    public class TestDataService
    {
        private readonly UnitOfWork unitOfWork;

        public TestDataService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<Student> SeedTestedStudents()
        {
            var finalStudents = new List<Student>(5 * 5);
            var rdGenerator = new Random();
            var departments = Enum.GetValues(typeof(Department)).Cast<Department>().ToList();
            var questionSeedService = new QuestionSeedService(unitOfWork);
            using (rdGenerator.CreateContext(0, departments.Count, nameof(Department)))
            {
                for (int i = 0; i < 5; ++i)
                {
                    var department = departments[rdGenerator.NextNonRepetitive(nameof(Department))];
                    var studentDictionary = unitOfWork.Cache.StudentEntities(department);
                    while (studentDictionary.Count == 0)
                    {
                        department = departments[rdGenerator.NextNonRepetitive(nameof(Department))];
                        studentDictionary = unitOfWork.Cache.StudentEntities(department);
                    }
                    var students = studentDictionary.GetAllValues();
                    using (rdGenerator.CreateContext(0, students.Count, nameof(Student)))
                    {
                        for (int j = 0; j < 5; ++j)
                        {
                            var student = students[rdGenerator.NextNonRepetitive(nameof(Student))];
                            while (student.IsTested)
                            {
                                student = students[rdGenerator.NextNonRepetitive(nameof(Student))];
                            }
                            var score = 0;
                            var seed = questionSeedService.RollSeed().Result;
                            var answers = questionSeedService.GetAnswersBySeedID(seed.ID).Result;
                            var submits = new byte[30];
                            for (int k = 0; k < answers.Count; ++k)
                            {
                                submits[k] = (byte)rdGenerator.Next(0, 4);
                                score += submits[k] == answers[k].Answer ? answers[k].Points : 0;
                            }
                            student.Score = score;
                            student.Choices = submits;
                            student.QuestionSeed = seed;
                            student.QuestionSeedID = seed.ID;
                            student.DateTimeFinished = DateTime.Now - TimeSpan.FromMinutes(rdGenerator.Next(0, 60));
                            student.TimeConsumed = TimeSpan.FromMinutes(rdGenerator.Next(0, 30));

                            finalStudents.Add(student);
                            studentDictionary[student.ID.ToStringID()] = student;
                            unitOfWork.Cache.StudentViewModels(department)[student.ID.ToStringID()] = (StudentViewModel)student;
                        }
                    }
                }
            }
            return finalStudents;
        }
    }
}
