using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net.Http.Formatting;  //在Microsoft.AspNet.WebApi.Client包中
using HistoryContest.Server.Controllers.APIs;
using Xunit;

namespace XUnitTest.WebAPItest.IntegrationTest
{
    public class ApiIdeasControllerTests : IClassFixture<TestFixture<HistoryContest.Server.Startup>>
    {
        internal class NewIdeaDto
        {
            public NewIdeaDto(string x) {
                information = x;
            }
            public string information;
        }

        private readonly HttpClient _client;

        public ApiIdeasControllerTests(TestFixture<HistoryContest.Server.Startup> fixture)
        {
            _client = fixture.Client;
        }

        [Fact]
        public async Task CreatePostReturnsBadRequestForMissingNameValue()
        {
            // Arrange
            var newIdea = new NewIdeaDto("haha");

            // Act
            var response = await _client.PostAsJsonAsync("/api/CounselorController/ExportExcelOfAllDepartments", newIdea);

            // Assert
            Assert.Equal("ScoreSummaryOfAllDepartments.xlsx", response.ToString());
        }
        /*
        [Fact]
        public async Task CreatePostReturnsBadRequestForMissingDescriptionValue()
        {
            // Arrange
            var newIdea = new NewIdeaDto("Name", "", 1);

            // Act
            var response = await _client.PostAsJsonAsync("/api/ideas/create", newIdea);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CreatePostReturnsBadRequestForSessionIdValueTooSmall()
        {
            // Arrange
            var newIdea = new NewIdeaDto("Name", "Description", 0);

            // Act
            var response = await _client.PostAsJsonAsync("/api/ideas/create", newIdea);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CreatePostReturnsBadRequestForSessionIdValueTooLarge()
        {
            // Arrange
            var newIdea = new NewIdeaDto("Name", "Description", 1000001);

            // Act
            var response = await _client.PostAsJsonAsync("/api/ideas/create", newIdea);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CreatePostReturnsNotFoundForInvalidSession()
        {
            // Arrange
            var newIdea = new NewIdeaDto("Name", "Description", 123);

            // Act
            var response = await _client.PostAsJsonAsync("/api/ideas/create", newIdea);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task CreatePostReturnsCreatedIdeaWithCorrectInputs()
        {
            // Arrange
            var testIdeaName = Guid.NewGuid().ToString();
            var newIdea = new NewIdeaDto(testIdeaName, "Description", 1);

            // Act
            var response = await _client.PostAsJsonAsync("/api/ideas/create", newIdea);

            // Assert
            response.EnsureSuccessStatusCode();
            var returnedSession = await response.Content.ReadAsJsonAsync<BrainstormSession>();
            Assert.Equal(2, returnedSession.Ideas.Count);
            Assert.True(returnedSession.Ideas.Any(i => i.Name == testIdeaName));
        }

        [Fact]
        public async Task ForSessionReturnsNotFoundForBadSessionId()
        {
            // Arrange & Act
            var response = await _client.GetAsync("/api/ideas/forsession/500");

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task ForSessionReturnsIdeasForValidSessionId()
        {
            // Arrange
            var testSession = Startup.GetTestSession();

            // Act
            var response = await _client.GetAsync("/api/ideas/forsession/1");

            // Assert
            response.EnsureSuccessStatusCode();
            var ideaList = JsonConvert.DeserializeObject<List<IdeaDTO>>(
                await response.Content.ReadAsStringAsync());
            var firstIdea = ideaList.First();
            Assert.Equal(testSession.Ideas.First().Name, firstIdea.Name);
        }*/
    }
}















/*
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using HistoryContest.Server.Controllers.APIs;
using System.Net.Http;
using System.Threading.Tasks;
using Moq;
using Xunit;
using System.Collections.Generic;
using Newtonsoft.Json;
using HistoryContest.Server.Data;

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
            // Arrange & Act
            var mockRepo = new Mock<UnitOfWork>();
            mockRepo.Setup(repo=>rep);
            var controller = new CounselorController(mockRepo.Object);

            // Act
            var result = await controller.ExportExcelOfAllDepartments();
            var responsestring = result.ToString();

            // Assert
            Assert.Equal(responsestring, "ScoreSummaryOfAllDepartments");


            
            // Act
            var response = await _client.GetAsync("/CounselorController/ExportExcelOfAllDepartments");
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            // Assert
            Assert.Equal(responseString, "ScoreSummaryOfAllDepartments.xlsx");
            
        }

    }
}
*/
