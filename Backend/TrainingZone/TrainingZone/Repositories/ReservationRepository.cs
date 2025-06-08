using Microsoft.EntityFrameworkCore;
using TrainingZone.Models.DataBase;
using TrainingZone.Repositories.Base;

namespace TrainingZone.Repositories
{
    public class ReservationRepository : Repository<Reservation, int>
    {
        public ReservationRepository(TrainingZoneContext context) : base(context) { }

        public async Task<Reservation> GetReservationByIdAsync(int reservationId)
        {
            return await _context.Reservations
                .Include(u => u.User).Include(s => s.Schedule)
                .FirstOrDefaultAsync(r => r.Id == reservationId);
        }

        public async Task<IEnumerable<Reservation>> GetReservationsByUserIdAsync(int userId)
        {
            return await _context.Reservations
                .Where(u => u.UserId == userId)
                .Include(u => u.User).Include(s => s.Schedule).ToListAsync();
        }

    }
}
