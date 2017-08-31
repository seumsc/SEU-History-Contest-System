using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace HistoryContest.Server.Models.Entities
{
    public class QuestionSeed : IEntityBase
    {
        public int ID { get; set; }
        [Required]
        [JsonRequired]
        internal string _questionIDs { get; set; }

        [JsonIgnore]
        [NotMapped]
        public int[] QuestionIDs
        {
            get { return _questionIDs.Split(',').Select(int.Parse).ToArray(); }
            set { _questionIDs = string.Join(",", value.Select(id => id.ToString()).ToArray()); }
        }
    }
}
