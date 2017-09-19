using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HistoryContest.Server.Models.Entities
{
    public class DeptWuID : IEntityBase
    {
        [JsonIgnore]
        public int ID { get; set; }
        [JsonConverter(typeof(HexIDConverter))]
        public int StudentID { get; set; }

        [JsonIgnore]
        public Student Student { get; set; }
    }
}
