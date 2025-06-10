using System.Threading.Tasks;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Reservation;

namespace TrainingZone.Mappers
{
    public class ReservationMapper
    {
        private readonly UnitOfWork _unitOfWork;

        public ReservationMapper(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public ReservationDto ToDto(Reservation reservation)
        {
            return new ReservationDto
            {
                Id = reservation.Id,
                UserId = reservation.UserId,
                ScheduleId = reservation.ScheduleId,
                ReservationDate = reservation.Schedule.StartDateTime
            };
        }

        public IEnumerable<ReservationDto> ToDto(IEnumerable<Reservation> reservations)
        {
            if(reservations == null || !reservations.Any())
            {
                return new List<ReservationDto>();
            }

            return reservations.Select(ToDto).ToList();
        }
    }
}
