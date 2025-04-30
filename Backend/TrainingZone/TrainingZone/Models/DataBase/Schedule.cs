namespace TrainingZone.Models.DataBase
{
    public class Schedule
    {
        public int Id { get; set; }
        public int ClassId { get; set; }
        public int Max_capacity { get; set; }
        public decimal Price { get; set; }
        public DateTime Start_datetime { get; set; }
        public DateTime End_datetime { get; set; }
    }
}
