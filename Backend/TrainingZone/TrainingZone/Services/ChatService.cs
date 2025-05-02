using System.Text.Json;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.WebSocket;
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

    internal Task HandleMessage(int userId, string message)
    {
        SocketMessage<ChatRequest> recived = JsonSerializer.Deserialize<SocketMessage<ChatRequest>>(message);

        switch (recived.Data.ChatRequestType)
        {
            case ChatRequestType.GET:
                SocketMessage<GetChatRequest> getChatRequest = JsonSerializer.Deserialize<SocketMessage<GetChatRequest>>(message);



                break;
            case ChatRequestType.SEND:
                SocketMessage<SendChatMessageRequest> sendMessageRequest = JsonSerializer.Deserialize<SocketMessage<SendChatMessageRequest>>(message);



                break;
            case ChatRequestType.MODIFY:
                SocketMessage<ModifyChatMessageRequest> ModifyMessageRequest = JsonSerializer.Deserialize<SocketMessage<ModifyChatMessageRequest>>(message);



                break;
            case ChatRequestType.DELETE:
                SocketMessage<DeleteChatMessageRequest> deleteMessageRequest = JsonSerializer.Deserialize<SocketMessage<DeleteChatMessageRequest>>(message);



                break;
        }

        return Task.CompletedTask;
    }
}
