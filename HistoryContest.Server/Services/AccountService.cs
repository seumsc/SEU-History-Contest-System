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
                    new Claim("displayName", userViewModel.RealName),
                    new Claim("username", userViewModel.UserName)
                });
            }

            return new AccountContext { UserEntity = user, UserViewModel = userViewModel, Claims = userClaims };
        }

        public UserViewModel CreateUser(string username, string password, string role)
        {

            return new UserViewModel();
        }

        public async Task<IUserBase> GetUser(string userName)
        {
            IUserBase user = null;

            user = await unitOfWork.AdminRepository.FirstOrDefaultAsync(u => u.UserName == userName);
            if (user != null)
            { // Check Administrators
                return user;
            }

            user = await unitOfWork.CounselorRepository.GetByIDAsync(userName.ToIntID());
            if(user != null)
            { // Check Counselors
                return user;
            }

            user = await unitOfWork.StudentRepository.GetByIDAsync(userName.ToIntID());
            if(user != null)
            { // Check Students
                return user;
            }

            return null;
        }
    }
}
