using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace HistoryContest.Server.Models.Entities
{
    public class Counselor : IUserBase
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [JsonConverter(typeof(HexIDConverter))]
        public int ID { get; set; }
        public string Name { get; set; }
        public int PhoneNumber { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public Department Department { get; set; }

        [JsonIgnore]
        public List<Student> Students { get; set; }

        public bool CheckPassword(string password)
        {
            return PhoneNumber == int.Parse(password);
        }
    }
}
