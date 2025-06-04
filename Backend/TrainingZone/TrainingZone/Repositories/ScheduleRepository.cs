using Microsoft.EntityFrameworkCore;
using TrainingZone.Models.DataBase;
using TrainingZone.Repositories.Base;

namespace TrainingZone.Repositories
{
    public class ScheduleRepository : Repository<Schedule, int>
    {
        public ScheduleRepository(TrainingZoneContext context) : base(context) { }
        
        public async Task<IEnumerable<Schedule>> GetScheduleByClassAsync(int classId)
        {
            return await _context.Schedules.Where(c => c.ClassId == classId).Include(c => c.Class)
                .Include(u => u.User).OrderBy(d => d.StartDateTime).ToListAsync();
        }

        public async Task<Schedule> GetScheduleByIdAsync(int scheduleId)
        {
            return await _context.Schedules.Include(c => c.Class).Include(u => u.User)
                .FirstOrDefaultAsync(s => s.Id == scheduleId);
        }
    }
}
