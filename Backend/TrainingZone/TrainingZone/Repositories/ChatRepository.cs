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

    internal async Task<List<Chat>> GetAllChatsByUserIdAsync(int userId)
    {
        return await GetQueryable()
            .Where(chat => chat.UserOriginId == userId || chat.UserDestinationId == userId)
            .Include(chat => chat.ChatMessages)
            .Include(chat => chat.UserOrigin)
            .Include(chat => chat.UserDestination)
            .OrderByDescending(chat => chat.ChatMessages.Max(m => (DateTime?)m.MessageDateTime))
            .ToListAsync();
    }


}
