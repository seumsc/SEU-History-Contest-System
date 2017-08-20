using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HistoryContest.Server.Data;
using HistoryContest.Server.Models.Entities;

namespace HistoryContest.Server.Services
{
    public class QuestionSeedService
    {
        private UnitOfWork unitOfWork;
        private Random rdGenerator;

        public QuestionSeedService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            var seed = Guid.NewGuid().GetHashCode();
            rdGenerator = new System.Random(seed);
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

        public async Task<QuestionSeed> CreateNewSeed()
        { // TODO:<yhy> 解决随机数重复问题 DONE
            var choiceQuestionsSize = await unitOfWork.QuestionRepository.SizeAsync<ChoiceQuestion>();
            var trueFalseQuestionsSize = await unitOfWork.QuestionRepository.SizeAsync<TrueFalseQuestion>();
            bool[] hashTableChoiceQuestions = new bool[choiceQuestionsSize];
            bool[] hashTabletrueFalseQuestions = new bool[trueFalseQuestionsSize];
            var questionIDs = new int[30];
            int randomnumber = 0;
            for (int i = 0; i < choiceQuestionsSize; i++)
            {
                hashTableChoiceQuestions[i] = false;
            }
            for (int i = 0; i < trueFalseQuestionsSize; i++)
            {
                hashTabletrueFalseQuestions[i] = false;
            }
            for (int i = 0; i < 20; i++)
            {
                randomnumber= rdGenerator.Next(0, choiceQuestionsSize - 1);
                while (hashTableChoiceQuestions[randomnumber % choiceQuestionsSize])
                    randomnumber++;
                questionIDs[i] = (randomnumber % choiceQuestionsSize) + 1;
                hashTableChoiceQuestions[randomnumber % choiceQuestionsSize] = true;
            }
            for (int i = 20; i < 30; i++)
            {
                randomnumber= rdGenerator.Next(0, trueFalseQuestionsSize - 1);
                while (hashTabletrueFalseQuestions[randomnumber % trueFalseQuestionsSize])
                    randomnumber++;
                questionIDs[i] = choiceQuestionsSize + (randomnumber % trueFalseQuestionsSize) + 1;
                hashTabletrueFalseQuestions[randomnumber % trueFalseQuestionsSize] = true;
            }
            QuestionSeed newSeed = new QuestionSeed { QuestionIDs = questionIDs };
            newSeed.Save();
            await unitOfWork.QuestionSeedRepository.InsertAsync(newSeed);
            return newSeed;
        }

        public async Task<QuestionSeed> RollSeed()
        {
            return await unitOfWork.QuestionSeedRepository.GetByIDAsync(rdGenerator.Next(1, unitOfWork.QuestionSeedRepository.Size()));
        }

        public void Save()
        {

        }
    }
}
