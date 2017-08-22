using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Models.ViewModels
{
    public class ScoreBandCountViewModel
    {
        public int HigherThan90 { get; set; }
        public int HigherThan75 { get; set; }
        public int HigherThan60 { get; set; }
        public int Failed { get; set; }
    }

    public class ScoreSummaryByDepartmentViewModel
    {
        public Department? DepartmentID { get; set; }
        public string CounselorName { get; set; }
        public int MaxScore { get; set; }
        public double AverageScore { get; set; }
        public ScoreBandCountViewModel ScoreBandCount { get; set; }
    }

    public class ScoreSummaryOfSchoolViewModel
    {
        public int MaxScore { get; set; }
        public double AverageScore { get; set; }
        public ScoreBandCountViewModel ScoreBandCount { get; set; }
        public int NumberTested { get; set; }
        public int NumberNotTested { get; set; }
        public DateTime UpdateTime { get; set; }
    }
}
