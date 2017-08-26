using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Data.Repositories;
using System;
using System.Threading.Tasks;

namespace HistoryContest.Server.Data
{
    public class UnitOfWork : IDisposable
    {
        private readonly ContestContext context;
        private readonly RedisService redisService;

        private readonly Lazy<StudentRepository> lazyStudentRepository;
        private readonly Lazy<GenericRepository<Counselor>> lazyCounselorRepository;
        private readonly Lazy<GenericRepository<Administrator>> lazyAdminRepository;
        private readonly Lazy<QuestionRepository> lazyQuestionRepository;
        private readonly Lazy<GenericRepository<QuestionSeed>> lazyQuestionSeedRepository;
        
        public UnitOfWork(ContestContext context, RedisService redisService = null)
        {
            this.context = context;
            this.redisService = redisService ?? new RedisService(Startup.Configuration);
            lazyStudentRepository = new Lazy<StudentRepository>(() => new StudentRepository(context, redisService));
            lazyCounselorRepository = new Lazy<GenericRepository<Counselor>>(() => new GenericRepository<Counselor>(context, redisService));
            lazyAdminRepository = new Lazy<GenericRepository<Administrator>>(() => new GenericRepository<Administrator>(context, redisService));
            lazyQuestionRepository = new Lazy<QuestionRepository>(() => new QuestionRepository(context, redisService));
            lazyQuestionSeedRepository = new Lazy<GenericRepository<QuestionSeed>>(() => new GenericRepository<QuestionSeed>(context, redisService));
        }

        public ContestContext DbContext
        {
            get { return context; }
        }

        public RedisService Cache
        {
            get { return redisService; }
        }

        #region Repository Properties
        public StudentRepository StudentRepository
        {
            get { return lazyStudentRepository.Value; }
        }

        public GenericRepository<Counselor> CounselorRepository
        {
            get { return lazyCounselorRepository.Value; }
        }

        public GenericRepository<Administrator> AdminRepository
        {
            get { return lazyAdminRepository.Value; }
        }

        public QuestionRepository QuestionRepository
        {
            get { return lazyQuestionRepository.Value; }
        }

        public GenericRepository<QuestionSeed> QuestionSeedRepository
        {
            get { return lazyQuestionSeedRepository.Value; }
        }
        #endregion

        public int Save()
        {
            return context.SaveChanges();
        }

        public async Task<int> SaveAsync()
        {
            return await context.SaveChangesAsync();
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
