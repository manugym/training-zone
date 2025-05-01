using Microsoft.EntityFrameworkCore;
using TrainingZone.Models.DataBase;
using TrainingZone.Repositories.Base;

namespace TrainingZone.Repositories;

public class ChatRepository : Repository<Chat, int>
{
    public ChatRepository(TrainingZoneContext context) : base(context){}

    internal async Task<Chat> GetChatByUserIdAndUserDestinationIdAsync(int userId, int userDestinationId)
    {
        return await GetQueryable()
            .Include(chat => chat.ChatMessages)
            .FirstOrDefaultAsync
                (chat => (chat.UserOriginId == userId && chat.UserDestinationId == userDestinationId) ||
                (chat.UserOriginId == userDestinationId && chat.UserDestinationId == userId));
                
    }
}
