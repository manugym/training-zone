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

        public async Task<ReservationDto> CreateReservationAsync(int userId, CreateReservationDto createReservationDto)
        {
            Schedule schedule = await _unitOfWork.ScheduleRepository.GetScheduleByIdAsync(createReservationDto.ScheduleId);
            Reservation reservation = new Reservation
            {
                UserId = userId,
                ScheduleId = createReservationDto.ScheduleId,
                ReservationDate = schedule.StartDateTime
            };

            _unitOfWork.Context.Reservations.Add(reservation);
            await _unitOfWork.Context.SaveChangesAsync();

            ReservationDto reservationDto = await _reservationMapper.ToDto(reservation);

            return reservationDto;
        }

        public async Task<IEnumerable<ReservationDto>> GetReservationsByUserId(int userId)
        {
            IEnumerable<Reservation> reservations = await _unitOfWork.ReservationRepository.GetReservationsByUserIdAsync(userId);

            IEnumerable<ReservationDto> reservationsDto = await _reservationMapper.ToDto(reservations);

            return reservationsDto;
        }

        public async Task<ReservationDto> DeleteReservationByIdAsync(int reservationId, int userId)
        {
            Reservation reservation = await _unitOfWork.ReservationRepository.GetReservationByIdAsync(reservationId);

            ReservationDto reservationDto = await _reservationMapper.ToDto(reservation);

            if (reservation == null || reservation.UserId != userId) return null;

            _unitOfWork.ReservationRepository.Delete(reservation);
            await _unitOfWork.SaveAsync();

            return reservationDto;
        }
        
    }
}
