namespace TrainingZone.Models.Dtos.Reservation
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ScheduleId { get; set; }
        public DateTime ReservationDate { get; set; }
    }
}
