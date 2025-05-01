using TrainingZone.Models.DataBase;
using TrainingZone.Repositories.Base;

namespace TrainingZone.Repositories;

public class ChatRepository : Repository<Chat, int>
{
    public ChatRepository(TrainingZoneContext context) : base(context){}
}
