using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using System.Net.Http;
using System.Threading.Tasks;
using HistoryContest.Server.Controllers.APIs;
using Moq;
using Xunit;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HistoryContest.Server.Test
{
    public class WebApiTest
    {
        private readonly TestServer _server;
        private readonly HttpClient _client;

        public WebApiTest()
        {
            // Arrange
            _server = new TestServer(new WebHostBuilder().UseStartup<Startup>());
            _client = _server.CreateClient();
        }

        [Fact]
        public async Task GetExcelOfSchoolName()
        {
            // Act
            var response = await _client.GetAsync("/CounselorController/ExportExcelOfAllDepartments");
            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();


            // Assert
            Assert.Equal(responseString, "ScoreSummaryOfAllDepartments.xlsx");
        }

    }
}
