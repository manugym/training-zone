using TrainingZone.Models.DataBase;
using TrainingZone.Repositories;

namespace TrainingZone.Services;

public class ChatService
{
    private readonly UnitOfWork _unitOfWork;

    public ChatService(UnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    internal async Task<Chat> GetChatAsync(int userId, int userDestinationId)
    {
        return await _unitOfWork.ChatRepository.GetChatByUserIdAndUserDestinationIdAsync(userId, userDestinationId);
    }
}
