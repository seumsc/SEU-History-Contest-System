using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HistoryContest.Server.Models;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Extensions;

namespace HistoryContest.Server.Data.Repositories
{
    public class StudentRepository : GenericRepository<Student>
    {
        public StudentRepository(ContestContext context, RedisService cache) : base(context, cache)
        {
            
        }

        #region All Students Methods
        public async Task<List<Student>> GetAll()
        {
            List<Student> students = new List<Student>();
            var departments = Enum.GetValues(typeof(Department));
            foreach (Department department in departments)
            {
                students.AddRange(await GetByDepartment(department));
            }
            return students;
        }

        public async override Task<int> SizeAsync()
        {
            int size = 0;
            var departments = Enum.GetValues(typeof(Department));
            foreach (Department department in departments)
            {
                size += (int)(await cache.Dictionary<string, Student>(department.ToString()).CountAsync());
            }
            return size;
        }

        public async Task<double> AverageScore() =>
            await (await GetAll()).AsQueryable().Select(s => (int)s.Score).AverageAsync();

        public async Task<int> HighestScore() =>
            await (await GetAll()).AsQueryable().Select(s => (int)s.Score).MaxAsync();

        public async Task<int> ScoreHigherThan(double bandScore) =>            
            await (await GetAll()).AsQueryable().CountAsync(s => s.IsTested && s.Score >= bandScore);

        public async Task<int> CountNotTested() =>
            await (await GetAll()).AsQueryable().CountAsync(s => !s.IsTested);
        #endregion

        #region Department Methods
        public async Task<List<string>> GetIDsByDepartment(Department department)
        {
            var studentDictionary = cache.Dictionary<string, Student>(department.ToString());
            if (await studentDictionary.CountAsync() != 0)
            {
                return await studentDictionary.GetAllStringKeysAsync();
            }
            else
            {
                var counselor = await context.Counselors.Where(c => c.Department == department).Include(c => c.Students).SingleAsync();
                await studentDictionary.SetRangeAsync(counselor.Students, s => s.ID.ToStringID());
                return counselor.Students.Select(s => s.ID.ToStringID()).ToList();
            }
        }

        public async Task<List<Student>> GetByDepartment(Department department)
        {
            var studentDictionary = cache.Dictionary<string, Student>(department.ToString());
            if (await studentDictionary.CountAsync() != 0)
            {
                return await studentDictionary.GetAllValuesAsync();
            }
            else
            {
                var counselor = await context.Counselors.Where(c => c.Department == department).Include(c => c.Students).SingleAsync();
                await studentDictionary.SetRangeAsync(counselor.Students, s => s.ID.ToStringID());
                return counselor.Students;
            }
        }

        public async Task<int> SizeByDepartment(Department department)
        {
            var studentDictionary = cache.Dictionary<string, Student>(department.ToString());
            int size = (int)(await studentDictionary.CountAsync());
            if (size == 0)
            {
                var counselor = await context.Counselors.Where(c => c.Department == department).Include(c => c.Students).SingleAsync();
                await studentDictionary.SetRangeAsync(counselor.Students, s => s.ID.ToStringID());
                size = counselor.Students.Count;
            }
            return size;
        }

        public async Task<double> AverageScoreByDepartment(Department department) =>            
            await (await GetByDepartment(department)).AsQueryable().Select(s => (int)s.Score).AverageAsync();
            
        public async Task<int> HighestScoreByDepartment(Department department) =>           
            await (await GetByDepartment(department)).AsQueryable().Select(s => (int)s.Score).MaxAsync();
                   
        public async Task<int> ScoreHigherThanByDepartment(double bandScore, Department department) =>           
            await (await GetByDepartment(department)).AsQueryable().CountAsync(s => s.IsTested && s.Score >= bandScore);

        public async Task<int> CountNotTestedByDepartment(Department department) =>
            await (await GetByDepartment(department)).AsQueryable().CountAsync(s => !s.IsTested);
        #endregion

        public void LoadStudentsToCache() =>
            context.Counselors.Include(c => c.Students).ToList().ForEach(c => cache.Dictionary<string, Student>(c.Department.ToString()).SetRange(c.Students, s => s.ID.ToStringID()));
    }
}
