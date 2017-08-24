using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace HistoryContest.Server.Models.Entities
{
    [Table("Questions")]
    [JsonObject(MemberSerialization.OptOut)]
    public abstract class AQuestionBase : IEntityBase 
    {
        [JsonIgnore]
        public int ID { get; set; }
        [JsonProperty(Order = 1)]
        public string Question { get; set; }
        [JsonProperty(Order = 2)]
        public byte Answer { get; set; }
        [JsonProperty(Order = 3)]
        public int Points { get; set; }
    }
}
