using Microsoft.EntityFrameworkCore;
using TrainingZone.Models.DataBase;
using TrainingZone.Repositories.Base;

namespace TrainingZone.Repositories
{
    public class ClassRepository : Repository<Class, int>
    {
        public ClassRepository(TrainingZoneContext context) : base(context) { }

        public async Task<Class> GetClassByIdAsync(int classId)
        {
            return await GetQueryable().FirstOrDefaultAsync(c => c.Id == classId);
        }

    }
}
