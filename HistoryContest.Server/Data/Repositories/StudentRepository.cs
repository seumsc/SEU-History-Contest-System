using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HistoryContest.Server.Models;
using HistoryContest.Server.Models.Entities;

namespace HistoryContest.Server.Data.Repositories
{
    public class StudentRepository : GenericRepository<Student>
    {
        //internal List<Counselor> counselorList;
        //internal DbSet<Counselor> counselorSet;

        public StudentRepository(ContestContext context, RedisService cache) : base(context, cache)
        {
            //counselorSet = context.Counselors;
            //counselorSet = context.Counselors;
        }

        public void LoadStudentsFromCounselors()
        {
            //counselorList = context.Counselors.Include(c => c.Students).ToList();
        }

        public async Task<ICollection<Student>> GetByDepartment(Department departmentID)
        {
            //counselorSet.Load();
            //context.Counselors.Where(c => c.Department == departmentID).Load();
            //counselorSet.Include(c => c.Students);
            var counselor = await context.Counselors.Where(c => c.Department == departmentID).Include(c => c.Students).SingleAsync();
            return counselor.Students;
        }

        public async Task<int> SizeByDepartment(Department departmentID) =>
            (await GetByDepartment(departmentID)).Count;

        public async Task<double> AverageScore() =>
            await dbSet.Select(s => (int)s.Score).AverageAsync();

        public async Task<int> HighestScore() =>
            await dbSet.Select(s => (int)s.Score).MaxAsync();

        public async Task<int> ScoreHigherThan(double bandScore) =>            
            await dbSet.CountAsync(s => s.IsTested && s.Score >= bandScore);
            
        public async Task<double> AverageScoreByDepartment(Department departmentID) =>            
            await (await GetByDepartment(departmentID)).AsQueryable().Select(s => (int)s.Score).AverageAsync();
            
        public async Task<int> HighestScoreByDepartment(Department departmentID) =>           
            await (await GetByDepartment(departmentID)).AsQueryable().Select(s => (int)s.Score).MaxAsync();
                   
        public async Task<int> ScoreHigherThanByDepartment(double bandScore, Department departmentID) =>           
            await (await GetByDepartment(departmentID)).AsQueryable().CountAsync(s => s.IsTested && s.Score >= bandScore);
            
    }
}
