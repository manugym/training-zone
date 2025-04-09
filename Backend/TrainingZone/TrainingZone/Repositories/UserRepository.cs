using TrainingZone.Models.DataBase;
using TrainingZone.Repositories.Base;

namespace TrainingZone.Repositories;

public class UserRepository: Repository<User,int>
{
    public UserRepository(TrainingZoneContext context) : base(context) { }

}
