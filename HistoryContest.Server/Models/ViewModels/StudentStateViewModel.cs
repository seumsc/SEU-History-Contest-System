using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Models.ViewModels
{
    public enum TestState
    {
        NotTested,
        Testing,
        Tested
    }

    public class StudentStateViewModel
    {
        public TestState TestState { get; set; }
        public bool IsSeedSet { get; set; }
    }
}
