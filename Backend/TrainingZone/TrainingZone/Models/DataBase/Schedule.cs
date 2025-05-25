namespace TrainingZone.Models.DataBase
{
    public class Schedule
    {
        public int Id { get; set; }
        public int ClassId { get; set; }
        public Class Class { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int MaxCapacity { get; set; }
        public decimal Price { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
    }
}
