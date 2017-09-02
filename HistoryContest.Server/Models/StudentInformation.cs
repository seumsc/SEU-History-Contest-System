using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Models
{
    [JsonObject(MemberSerialization.OptOut)]
    public class StudentInformation
    {
        [JsonProperty(Order = 1)]
        public string ID { get; set; }
        [JsonProperty(Order = 2)]
        public string Name { get; set; }
        [JsonProperty(Order = 3)]
        public string CardID { get; set; }
    }
}
