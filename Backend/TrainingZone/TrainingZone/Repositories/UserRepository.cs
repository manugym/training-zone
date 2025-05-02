using Microsoft.EntityFrameworkCore;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Enums;
using TrainingZone.Repositories.Base;

namespace TrainingZone.Repositories;

public class UserRepository: Repository<User,int>
{
    public UserRepository(TrainingZoneContext context) : base(context) { }

    public async Task<User> GetUserByCredentialAsync(string credential)
    {
        return await GetQueryable()
            .FirstOrDefaultAsync(user => user.Email == credential || user.Phone == credential);
    }

    public async Task<List<User>> GetAllTrainersAsync()
    {
        return await GetQueryable()
            .Where(user => user.Role == Role.TRAINER.ToString().ToLower())
            .ToListAsync();
    }

}
