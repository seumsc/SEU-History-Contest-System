using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Models.ViewModels
{
    public class ResultDetailViewModel
    {
        [DefaultValue(16)]
        public int ID { get; set; }
        [DefaultValue(1)]
        public int RightAnswer { get; set; }
        [DefaultValue(0)]
        public int SubmittedAnswer { get; set; }
    }

    public class ResultViewModel
    {
        [DefaultValue(60)]
        public double Score { get; set; }
        [DefaultValue(typeof(DateTime), "2017-08-21T16:31:44.218Z")]
        public DateTime TimeFinished { get; set; }
        [DefaultValue(typeof(TimeSpan), "00:20:34.2049107")]
        public TimeSpan TimeConsumed { get; set; }
        public List<ResultDetailViewModel> Details { get; set; }
    }
}
