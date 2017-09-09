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
using HistoryContest.Server.Extensions;
using OfficeOpenXml;

namespace HistoryContest.Server.Services
{
    public class DocParseService
    {
        public const string QuestionSqlFilePattern = @"\('(.*?)', '(.*?)', '(.*?)', '(.*?)', '(.*?)', '(.*?)', '(.*?)'\)";

        public static string[] ParseQuestionsFromSQL(string path, string pattern)
        {
            var info = new FileInfo(path);
            if (!info.Exists)
            {
                Console.WriteLine("File does not exist!");
                return null;
            }

            var choiceQuestions = new List<ChoiceQuestion>();
            var trueFalseQuestions = new List<TrueFalseQuestion>();

            using (StreamReader sr = new StreamReader(info.FullName))
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

        public static string ParseStudentsFromText(string path)
        {
            var info = new FileInfo(path);
            if (!info.Exists)
            {
                Console.WriteLine("File does not exist!");
                return null;
            }

            var students = JsonConvert.DeserializeObject<List<Student>>(File.ReadAllText(ContestContext.GetSeedPath<Student>()));
            var studentIDs = students.Select(s => s.ID).ToHashSet();

            using (StreamReader sr = new StreamReader(info.FullName))
            {
                Console.Write("Processing...Read ");
                sr.ReadLine();
                for (int i = 0; !sr.EndOfStream; ++i)
                {
                    Console.Write(i + 1);
                    string entry = sr.ReadLine();
                    string[] information = entry.Split("\t");

                    var student = new Student
                    {
                        ID = information[1].ToIntID(),
                        Name = information[0],
                        CardID = int.Parse(information[2])
                    };
                    if (!studentIDs.Contains(student.ID))
                    {
                        students.Add(student);
                        studentIDs.Add(student.ID);
                    }
                    Console.Write(new string('\b', (i + 1).ToString().Length));
                }
            }
            string studentSeedPath = ContestContext.GetSeedPath<Student>();

            Console.WriteLine("\nSerializing to json file...");
            File.WriteAllText(studentSeedPath, JsonConvert.SerializeObject(students.Select(s => new
            {
                ID = s.ID.ToStringID(),
                Name = s.Name,
                CardID = s.CardID.ToString()
            }), Formatting.Indented));

            Console.WriteLine("Finished.");
            return studentSeedPath;
        }

        public static string ParseStudentsFromExcel(string path)
        {
            var info = new FileInfo(path);
            if (!info.Exists)
            {
                Console.WriteLine("File does not exist!");
                return null;
            }

            var students = JsonConvert.DeserializeObject<List<Student>>(File.ReadAllText(ContestContext.GetSeedPath<Student>()));
            var studentIDs = students.Select(s => s.ID).ToHashSet();

            using (var package = new ExcelPackage(info))
            {
                Console.Write("Processing...Read ");
                var workSheet = package.Workbook.Worksheets.FirstOrDefault();
                for (int i = 2; i < workSheet.Dimension.End.Row; ++i)
                {
                    var progress = string.Format("{0}/{1}", i, workSheet.Dimension.End.Row);
                    Console.Write(progress);

                    var cardID = workSheet.Cells[i, 1].Value as string;
                    var studentID = workSheet.Cells[i, 2].Value as string;
                    var name = workSheet.Cells[i, 3].Value as string;

                    var student = new Student
                    {
                        ID = studentID.ToIntID(),
                        Name = name,
                        CardID = int.Parse(cardID)
                    };
                    if (!studentIDs.Contains(student.ID))
                    {
                        students.Add(student);
                        studentIDs.Add(student.ID);
                    }

                    Console.Write(new string('\b', progress.Length));
                }
            }
            string studentSeedPath = ContestContext.GetSeedPath<Student>();

            Console.WriteLine("\nSerializing to json file...");
            File.WriteAllText(studentSeedPath, JsonConvert.SerializeObject(students.Select(s => new
            {
                ID = s.ID.ToStringID(),
                Name = s.Name,
                CardID = s.CardID.ToString()
            }), Formatting.Indented));

            Console.WriteLine("Finished.");
            return studentSeedPath;
        }
    }
}
