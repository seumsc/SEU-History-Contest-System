using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Data.Repositories;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using System.Linq;
using HistoryContest.Server.Extensions;
using Microsoft.EntityFrameworkCore;

namespace HistoryContest.Server.Data
{
    public class UnitOfWork : IDisposable
    {
        private readonly ContestContext context;
        private readonly RedisService redisService;
        private readonly ContestSetting option;

        private readonly Lazy<StudentRepository> lazyStudentRepository;
        private readonly Lazy<GenericRepository<Counselor>> lazyCounselorRepository;
        private readonly Lazy<GenericRepository<Administrator>> lazyAdminRepository;
        private readonly Lazy<QuestionRepository> lazyQuestionRepository;
        private readonly Lazy<GenericRepository<QuestionSeed>> lazyQuestionSeedRepository;
        
        public UnitOfWork(ContestContext context, IOptions<ContestSetting> option, RedisService redisService = null)
        {
            this.context = context;
            this.redisService = redisService ?? new RedisService();
            this.option = option.Value;
            lazyStudentRepository = new Lazy<StudentRepository>(() => new StudentRepository(context, redisService));
            lazyCounselorRepository = new Lazy<GenericRepository<Counselor>>(() => new GenericRepository<Counselor>(context, redisService));
            lazyAdminRepository = new Lazy<GenericRepository<Administrator>>(() => new GenericRepository<Administrator>(context, redisService));
            lazyQuestionRepository = new Lazy<QuestionRepository>(() => new QuestionRepository(context, redisService));
            lazyQuestionSeedRepository = new Lazy<GenericRepository<QuestionSeed>>(() => new GenericRepository<QuestionSeed>(context, redisService));
        }

        public ContestSetting Configuration => option;

        public ContestContext DbContext => context;

        public RedisService Cache => redisService;

        #region Repository Properties
        public StudentRepository StudentRepository => lazyStudentRepository.Value;

        public GenericRepository<Counselor> CounselorRepository => lazyCounselorRepository.Value;

        public GenericRepository<Administrator> AdminRepository => lazyAdminRepository.Value;

        public QuestionRepository QuestionRepository => lazyQuestionRepository.Value;

        public GenericRepository<QuestionSeed> QuestionSeedRepository => lazyQuestionSeedRepository.Value;
        #endregion

        public int Save()
        {
            return context.SaveChanges();
        }

        public async Task<int> SaveAsync()
        {
            return await context.SaveChangesAsync();
        }

        public async Task SaveCacheToDataBase()
        {
            var questionSeeds = await Cache.QuestionSeeds().GetAllValuesAsync();
            if (!DbContext.QuestionSeeds.Any())
            {
                DbContext.Database.ExecuteSqlCommand("DBCC CHECKIDENT('QuestionSeeds', RESEED, 1)");
                questionSeeds.ForEach(s => s.ID = 0);
                await DbContext.QuestionSeeds.AddRangeAsync(questionSeeds);
            }
            else
            {
                DbContext.QuestionSeeds.UpdateRange(questionSeeds);
            }
            await DbContext.SaveChangesAsync();
            var studentIDs = await Cache.Database.ListRangeAsync("StudentIDsToUpdate");
            await Cache.Database.KeyDeleteAsync("StudentIDsToUpdate");
            var studentTasks = studentIDs.Select(async ID => await Cache.StudentEntities(ID.ToString().ToDepartmentID()).GetAsync(ID));
            foreach (var studentTask in studentTasks)
            {
                var student = await studentTask;
                StudentRepository.Update(student);
            }
            await DbContext.SaveChangesAsync();
        }

        #region Disposal Setting
        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if(!disposed && disposing)
            {
                context.Dispose();
            }
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true); // 调用context的回收方法
            GC.SuppressFinalize(this); // 阻止系统自己回收
        }
        #endregion
    }
}
