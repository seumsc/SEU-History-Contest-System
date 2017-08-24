using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Models.Entities
{
    [JsonObject(MemberSerialization.OptOut)]
    public class ChoiceQuestion : AQuestionBase
    {
        [JsonProperty(Order = 4)]
        public string ChoiceA { get; set; }
        [JsonProperty(Order = 5)]
        public string ChoiceB { get; set; }
        [JsonProperty(Order = 6)]
        public string ChoiceC { get; set; }
        [JsonProperty(Order = 7)]
        public string ChoiceD { get; set; }

        public ChoiceQuestion()
        {
            Points = 4;
        }

        [NotMapped]
        [JsonIgnore]
        public string[] AllChoices
        {
            get { return new string[] { ChoiceA, ChoiceB, ChoiceC, ChoiceD }; }
            set { ChoiceA = value[0]; ChoiceB = value[1]; ChoiceC = value[2]; ChoiceD = value[3]; }
        }
    }
}
