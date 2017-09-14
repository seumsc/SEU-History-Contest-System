using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using HistoryContest.Server.Data;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Models.ViewModels;
using HistoryContest.Server.Extensions;
using System.Net;
using System.Threading;

namespace HistoryContest.Server.Services
{
    public class AccountContext
    {
        public IUserBase UserEntity { get; set; }
        public UserViewModel UserViewModel { get; set; }
        public IEnumerable<Claim> Claims { get; set; }
    }

    public class AccountService
    {
        private UnitOfWork unitOfWork;

        public AccountService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<AccountContext> ValidateUser(string userName, string password)
        {
            UserViewModel userViewModel = null;
            var userClaims = new List<Claim>();

            IUserBase user = await GetUser(userName);
            if(user != null && user.CheckPassword(password))
            {
                userViewModel = new UserViewModel { UserName = userName, RealName = user.Name, Role = user.GetType().Name };
                userClaims.AddRange(new List<Claim>
                {
                    new Claim(ClaimTypes.Role, userViewModel.Role),
                    new Claim("RealName", userViewModel.RealName),
                    new Claim("UserName", userViewModel.UserName)
                });
            }

            return new AccountContext { UserEntity = user, UserViewModel = userViewModel, Claims = userClaims };
        }

        public async Task<UserViewModel> CreateUser(RegisterViewModel model)
        {
            if (await GetUser(model.UserName) != null)
            {
                throw new ArgumentException("UserName has already been registered.");
            }
            switch (model.Role)
            {
                case nameof(Student):
                    try
                    {
                        if (!await new VPNSpiderService(unitOfWork).ValidateStudentRegistration(model))
                        {
                            return null;
                        }
                    }
                    catch (WebException ex)
                    {
                        throw ex;
                    }
                    var counselor = await unitOfWork.CounselorRepository.FirstOrDefaultAsync(c => c.Department == model.UserName.ToDepartment());
                    var student = new Student
                    {
                        ID = model.UserName.ToIntID(),
                        CardID = int.Parse(model.Password),
                        Name = model.RealName,
                        CounselorID = counselor.ID,
                        Counselor = counselor
                    };
                    // Save Data
                    var summary = await unitOfWork.Cache.DepartmentScoreSummaries().GetAsync(counselor.Department);
                    if (summary != null)
                    {
                        ++summary.StudentCount;
                        ++summary.ScoreBandCount.NotTested;
                    }
                    await unitOfWork.Cache.DepartmentScoreSummaries().SetAsync(counselor.Department, summary);
                    await unitOfWork.Cache.StudentEntities(counselor.Department).SetAsync(model.UserName, student);
                    await unitOfWork.Cache.StudentViewModels(counselor.Department).SetAsync(model.UserName, (StudentViewModel)student);
                    await unitOfWork.StudentRepository.InsertAsync(student);
                    await unitOfWork.SaveAsync();

                    return new UserViewModel { UserName = model.UserName, RealName = model.RealName, Role = model.Role };
                case nameof(Counselor):
                    return null;
                case nameof(Administrator):
                    return null;
                default:
                    return null;
            }
        }

        public async Task<IUserBase> GetUser(string userName)
        {
            IUserBase user = null;

            if (userName.IsStudentID())
            {
                //user = await unitOfWork.StudentRepository.GetByIDAsync(userName.ToIntID());
                user = await unitOfWork.Cache.StudentEntities(userName.ToDepartment()).GetAsync(userName);
                if (user != null)
                { // Check Students
                    return user;
                }
            }

            if (userName.IsHexNumber())
            {
                user = await unitOfWork.CounselorRepository.GetByIDAsync(userName.ToIntID());
                if (user != null)
                { // Check Counselors
                    return user;
                }
            }

            user = await unitOfWork.AdminRepository.FirstOrDefaultAsync(u => u.UserName == userName);
            if (user != null)
            { // Check Administrators
                return user;
            }

            return null;
        }
    }
}
