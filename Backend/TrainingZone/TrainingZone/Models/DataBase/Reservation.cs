namespace TrainingZone.Models.DataBase
{
    public class Reservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ScheduleId { get; set; }
        public DateTime ReservationDate { get; set; }
        public User User { get; set; }
        public Schedule Schedule { get; set; }
    }
}
