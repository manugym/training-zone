using TrainingZone.Models.Dtos.User;

namespace TrainingZone.Models.Dtos.Schedule
{
    public class ScheduleDto
    {
        public int Id { get; set; }
        public int ClassId { get; set; }
        public string ClassType { get; set; }
        public string Description { get; set; }
        public UserDto Trainer { get; set; }
        public int MaxCapacity { get; set; }
        public decimal Price { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
    
    }
}
