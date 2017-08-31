using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;
using HistoryContest.Server.Extensions;

namespace HistoryContest.Server.Data.Repositories
{
    public class QuestionRepository : GenericRepository<AQuestionBase>
    {
        DbSet<ChoiceQuestion> choiceQuestionSet;
        DbSet<TrueFalseQuestion> trueFalseQuestionSet;

        public QuestionRepository(ContestContext context, RedisService cache) : base(context, cache)
        {
            choiceQuestionSet = context.Set<ChoiceQuestion>();
            trueFalseQuestionSet = context.Set<TrueFalseQuestion>();
        }

        public int Size<TQuestion>() where TQuestion : AQuestionBase
        {
            return context.Set<TQuestion>().Count();
        }

        public async Task<int> SizeAsync<TQuestion>() where TQuestion : AQuestionBase
        {
            return await context.Set<TQuestion>().CountAsync();
        }

        public TQuestion GetByID<TQuestion>(object id) where TQuestion : AQuestionBase
        {
            return context.Set<TQuestion>().Find(id);
        }

        public async Task<TQuestion> GetByIDAsync<TQuestion>(object id) where TQuestion : AQuestionBase
        {
            return await context.Set<TQuestion>().FindAsync(id);
        }

        public List<TQuestion> GetQuestions<TQuestion>() where TQuestion : AQuestionBase
        {
            return context.Set<TQuestion>().ToList();
        }

        public async Task<List<TQuestion>> GetQuestionsAsync<TQuestion>() where TQuestion : AQuestionBase
        {
            return await context.Set<TQuestion>().ToListAsync();
        }

        public TQuestion GetByIndex<TQuestion>(int index) where TQuestion : AQuestionBase
        {
            return context.Set<TQuestion>().AsEnumerable().ElementAtOrDefault(index);
        }

        public QuestionViewModel GetQuestionFromCache(int id)
        {
            var question = cache.Questions()[id];
            if (question == null)
            {
                question = (QuestionViewModel)GetByID(id);
                cache.Set(question.ID.ToString(), question);
            }
            return question;
        }

        public CorrectAnswerViewModel GetAnswerFromCache(int id)
        {
            var answer = cache.Answers()[id];
            if (answer == null)
            {
                answer = (CorrectAnswerViewModel)GetByID(id);
                cache.Set(answer.ID.ToString(), answer);
            }
            return answer;
        }

        public async Task<QuestionViewModel> GetQuestionFromCacheAsync(int id)
        {
            var question = await cache.Questions().GetAsync(id);
            if (question == null)
            {
                question = (QuestionViewModel) await GetByIDAsync(id);
                await cache.SetAsync(question.ID.ToString(), question);
            }
            return question;
        }

        public async Task<CorrectAnswerViewModel> GetAnswerFromCacheAsync(int id)
        {
            var answer = await cache.Answers().GetAsync(id);
            if (answer == null)
            {
                answer = (CorrectAnswerViewModel) await GetByIDAsync(id);
                await cache.SetAsync(answer.ID.ToString(), answer);
            }
            return answer;
        }

        public void LoadQuestionsToCache()
        {
            var questions = cache.Questions();
            var answers = cache.Answers();
            foreach (var question in dbSet)
            {
                questions[question.ID] = (QuestionViewModel)question;
                answers[question.ID] = (CorrectAnswerViewModel)question;
            }
        }
    }
}
