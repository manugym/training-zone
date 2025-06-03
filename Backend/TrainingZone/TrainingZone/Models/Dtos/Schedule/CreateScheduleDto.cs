namespace TrainingZone.Models.Dtos.Schedule
{
    public class CreateScheduleDto
    {
        public int ClassId { get; set; }
        public int UserId { get; set; }
        public int MaxCapacity { get; set; }
        public decimal Price { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
    }
}
