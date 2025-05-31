using TrainingZone.Models.Enums;

namespace TrainingZone.Models.DataBase
{
    public class Class
    {
        public int Id { get; set; }
        public ClassType Type { get; set; }
        public string Description { get; set; }

        public List<Schedule> Schedules { get; set; } = new List<Schedule>();
    }
}
