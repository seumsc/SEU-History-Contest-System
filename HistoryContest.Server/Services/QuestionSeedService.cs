using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HistoryContest.Server.Data;
using HistoryContest.Server.Extensions;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;

namespace HistoryContest.Server.Services
{
    public class QuestionSeedService
    {
        private UnitOfWork unitOfWork;
        private Random rdGenerator;

        public QuestionSeedService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            rdGenerator = new Random();
        }

        public async Task<List<QuestionViewModel>> GetQuestionsBySeedID(int id)
        {
            var seed = await unitOfWork.Cache.QuestionSeeds().GetAsync(id);
            if (seed == null)
            {
                return null;
            }

            var questionIDs = seed.QuestionIDs;
            var questions = new List<QuestionViewModel>(questionIDs.Length);
            foreach (var ID in questionIDs)
            {
                questions.Add(await unitOfWork.QuestionRepository.GetQuestionFromCacheAsync(ID));
            }
            return questions;
        }

        public async Task<List<CorrectAnswerViewModel>> GetAnswersBySeedID(int id)
        {
            var seed = await unitOfWork.Cache.QuestionSeeds().GetAsync(id);
            if (seed == null)
            {
                return null;
            }

            var questionIDs = seed.QuestionIDs;
            var answers = new List<CorrectAnswerViewModel>(questionIDs.Length);
            foreach (var ID in questionIDs)
            {
                answers.Add(await unitOfWork.QuestionRepository.GetAnswerFromCacheAsync(ID));
            }
            return answers;
        }

        public List<QuestionSeed> CreateNewSeeds(int scale)
        {
            List<QuestionSeed> seeds = new List<QuestionSeed>(scale);
            List<ChoiceQuestion> choiceQuestions = unitOfWork.QuestionRepository.GetQuestions<ChoiceQuestion>();
            List<TrueFalseQuestion> trueFalseQuestions = unitOfWork.QuestionRepository.GetQuestions<TrueFalseQuestion>();
            var questionIDs = new int[30];
    
            using (rdGenerator.CreateContext(0, choiceQuestions.Count, nameof(ChoiceQuestion)))
            using (rdGenerator.CreateContext(0, trueFalseQuestions.Count, nameof(TrueFalseQuestion)))
            {
                Console.Write("Processing...Generated ");
                var progress = string.Empty;
                for (int i = 0; i < scale; ++i)
                {
                    Console.Write(new string('\b', progress.Length));
                    progress = string.Format("{0}/{1}", i + 1, scale); 
                    Console.Write(progress);

                    for (int j = 0; j < unitOfWork.Configuration.QuestionCount.Choice; ++j)
                    {
                        var index = rdGenerator.NextNonRepetitive(nameof(ChoiceQuestion));
                        questionIDs[j] = choiceQuestions[index].ID;
                    }
                    for (int j = 0; j < unitOfWork.Configuration.QuestionCount.TrueFalse; ++j)
                    {
                        var index = rdGenerator.NextNonRepetitive(nameof(TrueFalseQuestion));
                        questionIDs[unitOfWork.Configuration.QuestionCount.Choice + j] = trueFalseQuestions[index].ID;
                    }

                    seeds.Add(new QuestionSeed { ID = i + 1, QuestionIDs = questionIDs });
                    rdGenerator.ResetContext(nameof(ChoiceQuestion));
                    rdGenerator.ResetContext(nameof(TrueFalseQuestion));
                }
            }

            return seeds;
        }

        public async Task<QuestionSeed> RollSeed()
        {
            var questionSeedDictionary = unitOfWork.Cache.QuestionSeeds();
            var size = (int)await questionSeedDictionary.CountAsync();
            var rd = rdGenerator.Next(1, size + 1);
            var result = await questionSeedDictionary.GetAsync(rd);
            return result;
        }
    }
}
