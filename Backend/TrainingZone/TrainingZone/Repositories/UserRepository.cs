using Microsoft.EntityFrameworkCore;
using TrainingZone.Models.DataBase;
using TrainingZone.Repositories.Base;

namespace TrainingZone.Repositories;

public class UserRepository: Repository<User,int>
{
    public UserRepository(TrainingZoneContext context) : base(context) { }

    public async Task<User> GetUserByCredential(string credential)
    {
        return await GetQueryable()
            .FirstOrDefaultAsync(user => user.Email == credential || user.Phone == credential);
    }
}
