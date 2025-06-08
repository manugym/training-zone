using TrainingZone.Mappers;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Reservation;

namespace TrainingZone.Services
{
    public class ReservationService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly ReservationMapper _reservationMapper;
        
        public ReservationService(UnitOfWork unitOfWork, ReservationMapper reservationMapper)
        {
            _unitOfWork = unitOfWork;
            _reservationMapper = reservationMapper;
        }

        public async Task<ReservationDto> CreateReservationAsync(int userId, int scheduleId)
        {
            Schedule schedule = await _unitOfWork.ScheduleRepository.GetScheduleByIdAsync(scheduleId);

            if (schedule == null) return null;

            Reservation reservation = new Reservation
            {
                UserId = userId,
                ScheduleId = scheduleId,
                ReservationDate = schedule.StartDateTime
            };

            _unitOfWork.Context.Reservations.Add(reservation);
            await _unitOfWork.Context.SaveChangesAsync();

            Reservation fullReservation = await _unitOfWork.ReservationRepository.GetReservationByIdAsync(reservation.Id);

            ReservationDto reservationDto = _reservationMapper.ToDto(fullReservation);

            return reservationDto;
        }

        public async Task<IEnumerable<ReservationDto>> GetReservationsByUserId(int userId)
        {
            IEnumerable<Reservation> reservations = await _unitOfWork.ReservationRepository.GetReservationsByUserIdAsync(userId);

            IEnumerable<ReservationDto> reservationsDto = _reservationMapper.ToDto(reservations);

            return reservationsDto;
        }

        public async Task<ReservationDto> DeleteReservationByIdAsync(int reservationId, int userId)
        {
             Reservation reservation = await _unitOfWork.ReservationRepository.GetReservationByIdAsync(reservationId);

            if (reservation == null || reservation.UserId != userId) return null;

            ReservationDto reservationDto = _reservationMapper.ToDto(reservation);

            _unitOfWork.ReservationRepository.Delete(reservation);
            await _unitOfWork.SaveAsync();

            return reservationDto;
        }
        
    }
}
