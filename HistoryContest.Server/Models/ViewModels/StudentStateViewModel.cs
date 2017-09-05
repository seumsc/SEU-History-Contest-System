using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Models.ViewModels
{
    public enum TestState
    {
        NotTested = 0,
        Testing = 1,
        Tested = 2
    }

    public class StudentStateViewModel
    {
        public TestState TestState { get; set; }
        public bool IsSeedSet { get; set; }
    }
}
