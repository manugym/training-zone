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


    //Gets all the users you have had a conversation with
    internal async Task<List<User>> GetAllUsersWithChatAsync(int userId)
    {
        return await GetQueryable()
            .Where(chat => chat.UserOriginId == userId || chat.UserDestinationId == userId)
            .Select(chat => chat.UserOriginId == userId ? chat.UserDestination : chat.UserOrigin)
            .Distinct()
            .ToListAsync();
    }

}
