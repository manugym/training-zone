using TrainingZone.Models.DataBase;
using TrainingZone.Repositories.Base;

namespace TrainingZone.Repositories;

public class ChatMessageRepository : Repository<ChatMessage, int>
{
    public ChatMessageRepository(TrainingZoneContext context) : base(context){}
}
