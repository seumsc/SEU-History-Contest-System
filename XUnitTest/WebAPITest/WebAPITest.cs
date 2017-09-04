/*using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;


//..并没有用
namespace HistoryContest.Server.Test
{
    public class WebApiTest
    {
        private readonly TestServer _server;
        private readonly HttpClient _client;

        public WebApiTest()
        {
            _server = new TestServer(new WebHostBuilder().UseStartup<Startup>());
            _client = _server.CreateClient();
        }

        [Fact]
        public async Task GetExcelOfSchoolName()
        {
            var response = await _client.GetAsync("/CounselorController/ScoreSummaryOfAllDepartments.xlsx");
            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();

            Assert.Equal(responseString, "ScoreSummaryOfAllDepartments.xlsx");
        }

    }
}*/
