using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Reservation;
using TrainingZone.Services;

namespace TrainingZone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly ReservationService _reservationService;

        public ReservationController(ReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> createReservation(int scheduleId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized();
            }

            ReservationDto newReservation = await _reservationService.CreateReservationAsync(userIdInt, scheduleId);

            if (newReservation == null)
            {
                return NotFound("El id de la reserva no existe");
            }

            return Ok(newReservation);
        }

        [Authorize]
        [HttpGet("reservationsByUser")]
        public async Task<IActionResult> GetReservationsByUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized();
            }

            IEnumerable<ReservationDto> reservations = await _reservationService.GetReservationsByUserId(userIdInt);

            return Ok(reservations);
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteReservationById(int reservationId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized();
            }

            ReservationDto reservationDto = await _reservationService.DeleteReservationByIdAsync(reservationId, userIdInt);

            return Ok(reservationDto);
        }
    }
}
