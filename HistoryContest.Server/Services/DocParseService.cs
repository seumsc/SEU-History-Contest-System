using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using HistoryContest.Server.Models.Entities;
using HistoryContest.Server.Data;
using Newtonsoft.Json;
using HistoryContest.Server.Models;

namespace HistoryContest.Server.Services
{
    public class DocParseService
    {
        public const string QuestionSqlFilePattern = @"\('(.*?)', '(.*?)', '(.*?)', '(.*?)', '(.*?)', '(.*?)', '(.*?)'\)";

        public static string[] ParseQuestions(string path, string pattern)
        {
            var choiceQuestions = new List<ChoiceQuestion>();
            var trueFalseQuestions = new List<TrueFalseQuestion>();

            using (StreamReader sr = new StreamReader(path))
            {
                Console.Write("Processing...Parsed ");
                var entries = sr.ReadToEnd().Split('\n');
                for (int i = 0; i < entries.Length; ++i)
                {
                    var progress = string.Format("{0}/{1}", i + 1, entries.Length);
                    Console.Write(progress);

                    string entry = entries[i];
                    // 匹配项这样写是为了及时判断题型以及根据位置分别处理内容
                    var match = Regex.Match(entry, pattern);

                    // ID是不需要记录的，在添加进数据库时自动生成
                    string question = match.Groups[2].Value;
                    byte answer = (byte)(char.Parse(match.Groups[3].Value) - 'a');

                    if (match.Groups.Last().Value != "")
                    { // 选择题
                        choiceQuestions.Add(new ChoiceQuestion { Question = question, Answer = answer, AllChoices = match.Groups.Skip(4).Select(g => g.Value).ToArray() });
                    }
                    else
                    { // 判断题
                        trueFalseQuestions.Add(new TrueFalseQuestion { Question = question, Answer = answer });
                    }

                    Console.Write(new string('\b', progress.Length));
                }
            }

            string choiceSeedPath = ContestContext.GetSeedPath<ChoiceQuestion>();
            string trueFalseSeedPath = ContestContext.GetSeedPath<TrueFalseQuestion>();

            Console.WriteLine("\nSerializing to json file...");

            File.WriteAllText(choiceSeedPath, JsonConvert.SerializeObject(choiceQuestions, Formatting.Indented));
            File.WriteAllText(trueFalseSeedPath, JsonConvert.SerializeObject(trueFalseQuestions, Formatting.Indented));

            Console.WriteLine("Finished.");
            return new string[] { choiceSeedPath, trueFalseSeedPath };
        }

        public static string[] ParseStudentInformation(string path)
        {
            var students = new List<StudentInformation>();

            using (StreamReader sr = new StreamReader(path))
            {
                Console.Write("Processing...Parsed ");
                var entries = sr.ReadToEnd().Split("\r\n");
                Console.WriteLine("entries:{0}", entries.Length-1);

                for (int i = 1; i < entries.Length; ++i)
                {
                    string oneline = entries[i].ToString();

                    string[] information = oneline.Split("\t");
                    
                    students.Add(new StudentInformation
                    {
                        ID = information[1],
                        Name = information[0],
                        CardID = information[2]
                    });
                }
            }

            string studentSeedPath = ContestContext.GetSeedPath<Student>();

            Console.WriteLine("\nSerializing to json file...");
            File.WriteAllText(studentSeedPath, JsonConvert.SerializeObject(students, Formatting.Indented));

            Console.WriteLine("Finished.");
            return new string[] { studentSeedPath };
        }
    }
}
