using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HistoryContest.Server.Data;
using HistoryContest.Server.Extensions;
using HistoryContest.Server.Models.Entities;

namespace HistoryContest.Server.Services
{
    public class QuestionSeedService
    {
        private UnitOfWork unitOfWork;
        private Random rdGenerator;
        private int size_ChoiceQuestions;
        private int size_TrueFalseQuestions;

        public QuestionSeedService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            rdGenerator = new Random();
            size_ChoiceQuestions = unitOfWork.QuestionRepository.Size<ChoiceQuestion>();
            size_TrueFalseQuestions = unitOfWork.QuestionRepository.Size<TrueFalseQuestion>();
        }

        public async Task<IEnumerable<AQuestionBase>> GetQuestionsBySeedID(int id)
        {
            var seed = await unitOfWork.QuestionSeedRepository.GetByIDAsync(id);
            if (seed == null)
            {
                return null;
            }

            var questionIDs = seed.QuestionIDs;
            var questions = new AQuestionBase[questionIDs.Length];
            for (int i = 0; i < 30; i++)
            {
                questions[i] = await unitOfWork.QuestionRepository.GetByIDAsync(questionIDs[i]);
            }
            return questions;
        }

        public List<QuestionSeed> CreateNewSeeds(int scale)
        {
            List<QuestionSeed> seeds = new List<QuestionSeed>(scale);
            var questionIDs = new int[30];
    
            using (rdGenerator.CreateContext(0, size_ChoiceQuestions, nameof(ChoiceQuestion)))
            using (rdGenerator.CreateContext(0, size_TrueFalseQuestions, nameof(TrueFalseQuestion)))
            {
                Console.Write("Processing...Generated ");
                var progress = string.Empty;
                for (int i = 0; i < scale; ++i)
                {
                    Console.Write(new string('\b', progress.Length));
                    progress = string.Format("{0}/{1}", i + 1, scale);
                    Console.Write(progress);

                    for (int j = 0; j < 20; ++j)
                    {
                        var index = rdGenerator.NextNonRepetitive(nameof(ChoiceQuestion));
                        questionIDs[j] = unitOfWork.QuestionRepository.GetByIndex<ChoiceQuestion>(index).ID;
                    }
                    for (int j = 20; j < 30; ++j)
                    {
                        var index = rdGenerator.NextNonRepetitive(nameof(TrueFalseQuestion));
                        questionIDs[j] = unitOfWork.QuestionRepository.GetByIndex<TrueFalseQuestion>(index).ID;
                    }

                    seeds.Add(new QuestionSeed { QuestionIDs = questionIDs });
                    rdGenerator.ResetContext(nameof(ChoiceQuestion));
                    rdGenerator.ResetContext(nameof(TrueFalseQuestion));
                }
            }

            return seeds;
        }

        public async Task<QuestionSeed> RollSeed()
        {
            return await unitOfWork.QuestionSeedRepository.GetByIDAsync(rdGenerator.Next(1, unitOfWork.QuestionSeedRepository.Size()));
        }
    }
}
