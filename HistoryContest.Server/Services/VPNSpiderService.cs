using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using System.Text;
using HistoryContest.Server.Models.ViewModels;

namespace HistoryContest.Server.Services
{
    public class VPNSpiderService
    {
        string CookieHeader { get; set; }

        public bool ValidateStudentRegistration(RegisterViewModel model)
        {
            if (ConnectToVPN("username", "password"))
            {
                var rawData = GetStudentData(model.UserName);

                LogOut();
                return true;
            }
            else
            {
                throw new WebException("Problem in connecting validation network");
            }
        }

        public bool ConnectToVPN(string userName, string password)
        {
            string formUrl = "https://vpn3.seu.edu.cn/dana-na/auth/url_default/login.cgi"; 
            string formParams = string.Format("tz_offset=480&username={0}&password={1}&realm=vpn_ids&btnSubmit=登录", userName, password);
            WebRequest request = WebRequest.Create(formUrl);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.Headers.Add(HttpRequestHeader.Connection, @"keep-alive");
            request.Headers.Add(HttpRequestHeader.CacheControl, @"max-age=0");
            request.Headers.Add(HttpRequestHeader.Accept, @"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
            request.Headers.Add(HttpRequestHeader.AcceptEncoding, @"gzip, deflate, br");
            request.Headers.Add(HttpRequestHeader.AcceptLanguage, @"zh-CN,zh;q=0.8");

            byte[] bytes = Encoding.UTF8.GetBytes(formParams);
            request.ContentLength = bytes.Length;

            using (Stream os = request.GetRequestStream())
            {
                os.Write(bytes, 0, bytes.Length);
            }
            WebResponse response = request.GetResponse();
            CookieHeader = response.Headers["Set-cookie"];
            return true;
        }

        public string GetStudentData(string ID)
        {
            string getUrl = string.Format(@"https://vpn3.seu.edu.cn/jw_service/service/,DanaInfo=xk.urp.seu.edu.cn+stuCurriculum.action?queryStudentId={0}&queryAcademicYear=17-18-1", ID);
            WebRequest request = WebRequest.Create(getUrl);
            request.Headers.Add(HttpRequestHeader.Cookie, CookieHeader);
            WebResponse response = request.GetResponse();
            string pageSource;
            using (StreamReader sr = new StreamReader(response.GetResponseStream()))
            {
                pageSource = sr.ReadToEnd();
            }
            return pageSource;
        }

        public void LogOut()
        {
            string getUrl = @"https://vpn3.seu.edu.cn/dana-na/auth/logout.cgi";
            WebRequest request = WebRequest.Create(getUrl);
            request.Headers.Add(HttpRequestHeader.Cookie, CookieHeader);
            WebResponse response = request.GetResponse();
        }
    }
}
