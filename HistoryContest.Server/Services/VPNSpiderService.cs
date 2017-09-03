using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using HistoryContest.Server.Models.ViewModels;
using System.Net.Http;
using HistoryContest.Server.Data;

namespace HistoryContest.Server.Services
{
    public class VPNSpiderService
    {
        private readonly UnitOfWork unitOfWork;
        public static CookieContainer CookieContainer { get; set; } = new CookieContainer();
        public HttpClient Client { get; set; }

        public VPNSpiderService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            Client = new HttpClient(new HttpClientHandler { AllowAutoRedirect = false, UseCookies = true, CookieContainer = CookieContainer });
        }

        public async Task<bool> ValidateStudentRegistration(RegisterViewModel model)
        {
            if (await ConnectToVPN(unitOfWork.Configuration.VPNConnection[0], unitOfWork.Configuration.VPNConnection[1]))
            {
                var rawData = await GetStudentData(model.UserName);
                await LogOut();
                if (!rawData.Any())
                {
                    throw new WebException("Problem in connecting validation network");
                }
                if (rawData.Contains("没有找到该学生信息"))
                {
                    return false;
                }
                var matches = Regex.Matches(rawData, "<td width=\"20%\" align=\"left\">(.*?):(.*?)</td>");
                var information = matches.ToDictionary(m => m.Groups[1].Value, m => m.Groups[2].Value);
                return model.UserName == information["学号"] && model.Password == information["一卡通号"] && model.RealName == information["姓名"];
            }
            else
            {
                await LogOut();
                throw new WebException("Problem in connecting validation network");
            }
        }

        public async Task<bool> ConnectToVPN(string userName, string password)
        {
            string formUrl = "https://vpn3.seu.edu.cn/dana-na/auth/url_default/login.cgi";
            string formParams = string.Format("tz_offset=480&username={0}&password={1}&realm=vpn_ids&btnSubmit=登录", userName, password);

            var response = await PostRequest(formUrl, formParams);
            
            if (response.Headers.Location.AbsoluteUri.Contains(@"index.cgi"))
            { // 正常进入学生主页
                return true;
            }
            else if (response.Headers.Location.AbsoluteUri.Contains(@"welcome.cgi?p=user-confirm"))
            { // 当前有活动Session，需要关闭
                var pageSource = await (await GetRequest(response.Headers.Location.AbsoluteUri)).Content.ReadAsStringAsync();
                var webResponse = await ConfirmOpenSession(pageSource);
                return !webResponse.Headers.Location.AbsoluteUri.Contains(@"welcome.cgi?p=failed"); // 选择Session关闭失败
            }
            else if (response.Headers.Location.AbsoluteUri.Contains(@"welcome.cgi?p=failed"))
            { // 登录失败
                return false;
            }
            else if (response.Headers.Location.AbsoluteUri.Contains(@"welcome.cgi"))
            {
                return await ConnectToVPN(userName, password);
            }
            return false;
        }

        public async Task LogOut()
        {
            string getUrl = @"https://vpn3.seu.edu.cn/dana-na/auth/logout.cgi";
            await GetRequest(getUrl);
        }

        private async Task<HttpResponseMessage> ConfirmOpenSession(string pageSource)
        {
            var matches = Regex.Matches(pageSource, "<input.*?name=\"(.*?)\".*?value=\"(.*?)\".*?>");
            var formParams = matches.ToDictionary(m => m.Groups[1].Value, m => m.Groups[2].Value);
            string confirmUrl = "https://vpn3.seu.edu.cn/dana-na/auth/url_default/login.cgi";
            string confirmParams = string.Format("postfixSID={0}&btnContinue=关闭选定会话并登录&FormDataStr={1}", formParams["postfixSID"], formParams["FormDataStr"]);
            return await PostRequest(confirmUrl, confirmParams);
        }

        private async Task<string> GetStudentData(string ID)
        {
            string getUrl = string.Format(@"https://vpn3.seu.edu.cn/jw_service/service/,DanaInfo=xk.urp.seu.edu.cn+stuCurriculum.action?queryStudentId={0}&queryAcademicYear=17-18-1", ID);
            var response = await GetRequest(getUrl);
            return await response.Content.ReadAsStringAsync();
        }

        private async Task<HttpResponseMessage> PostRequest(string formUrl, string formParams)
        {
            var client = new HttpClient(new HttpClientHandler { AllowAutoRedirect = false, UseCookies = true, CookieContainer = CookieContainer });
            var content = new StringContent(formParams, Encoding.UTF8, "application/x-www-form-urlencoded");
            return await Client.PostAsync(formUrl, content);
        }

        private async Task<HttpResponseMessage> GetRequest(string getUrl)
        {
            return await Client.GetAsync(getUrl);
        }
    }
}
