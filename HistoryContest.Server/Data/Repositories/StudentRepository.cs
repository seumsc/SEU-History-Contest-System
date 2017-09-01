using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HistoryContest.Server.Models;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Extensions;
using HistoryContest.Server.Models.ViewModels;

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
                size += (int)(await cache.StudentEntities(department).CountAsync());
            }
            return size;
        }

        public async Task<double> AverageScore() =>
            (await GetAll()).AsQueryable().Where(s => s.IsTested).DefaultIfEmpty(new Student()).Average(s => s.Score ?? 0);

        public async Task<int> HighestScore() =>
            (await GetAll()).AsQueryable().DefaultIfEmpty(new Student()).Max(s => s.Score ?? 0);

        public async Task<int> ScoreHigherThan(double bandScore) =>            
            (await GetAll()).AsQueryable().Count(s => s.IsTested && s.Score >= bandScore);

        public async Task<int> CountNotTested() =>
            (await GetAll()).AsQueryable().Count(s => !s.IsTested);
        
        #endregion

        #region Department Methods
        public async Task<List<string>> GetIDsByDepartment(Department department)
        {
            var studentDictionary = cache.StudentEntities(department);
            if (await studentDictionary.CountAsync() != 0)
            {
                return await studentDictionary.GetAllStringKeysAsync();
            }
            else
            {
                var counselor = context.Counselors.Where(c => c.Department == department).Include(c => c.Students).SingleOrDefault();
                if (counselor == null)
                {
                    return new List<string>();
                }
                await studentDictionary.SetRangeAsync(counselor.Students, s => s.ID.ToStringID());
                return counselor.Students.Select(s => s.ID.ToStringID()).ToList();
            }
        }

        public async Task<List<Student>> GetByDepartment(Department department)
        {
            var studentDictionary = cache.StudentEntities(department);
            if (await studentDictionary.CountAsync() != 0)
            {
                return await studentDictionary.GetAllValuesAsync();
            }
            else
            {
                var counselor = context.Counselors.Where(c => c.Department == department).Include(c => c.Students).SingleOrDefault();
                if (counselor == null)
                {
                    return new List<Student>();
                }
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
                var counselor = context.Counselors.Where(c => c.Department == department).Include(c => c.Students).SingleOrDefault();
                if (counselor == null)
                {
                    return 0;
                }
                await studentDictionary.SetRangeAsync(counselor.Students, s => s.ID.ToStringID());
                size = counselor.Students.Count;
            }
            return size;
        }

        public async Task<double> AverageScoreByDepartment(Department department) =>            
            (await GetByDepartment(department)).AsQueryable().Where(s => s.IsTested).DefaultIfEmpty(new Student()).Average(s => s.Score ?? 0);
            
        public async Task<int> HighestScoreByDepartment(Department department) =>           
            (await GetByDepartment(department)).AsQueryable().DefaultIfEmpty(new Student()).Max(s => s.Score ?? 0);
                   
        public async Task<int> ScoreHigherThanByDepartment(double bandScore, Department department) =>           
            (await GetByDepartment(department)).AsQueryable().Count(s => s.IsTested && s.Score >= bandScore);

        public async Task<int> CountNotTestedByDepartment(Department department) =>
            (await GetByDepartment(department)).AsQueryable().Count(s => !s.IsTested);
        #endregion

        public void LoadStudentsToCache() =>
            context.Counselors.Include(c => c.Students).ToList().ForEach(c =>
            {
                cache.StudentEntities(c.Department).SetRange(c.Students, s => s.ID.ToStringID());
                cache.StudentViewModels(c.Department).SetRange(c.Students.Select(s => (StudentViewModel)s), s => s.StudentID);
            });
    }
}
