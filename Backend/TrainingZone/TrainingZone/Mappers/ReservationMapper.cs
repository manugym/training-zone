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

        public async Task<ReservationDto> ToDto(Reservation reservation)
        {
            Reservation fulReservation = await _unitOfWork.ReservationRepository.GetReservationByIdAsync(reservation.Id);
            return new ReservationDto
            {
                Id = reservation.Id,
                UserId = reservation.UserId,
                ScheduleId = reservation.ScheduleId,
                ReservationDate = fulReservation.Schedule.StartDateTime
            };
        }

        public async Task<IEnumerable<ReservationDto>> ToDto(IEnumerable<Reservation> reservations)
        {
            if(reservations == null || !reservations.Any())
            {
                return new List<ReservationDto>();
            }

            var dtoList = reservations.Select(reservation => ToDto(reservation));
            return await Task.WhenAll(dtoList);
        }
    }
}
