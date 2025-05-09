using System.Text.Json;
using TrainingZone.Mappers;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Chat;
using TrainingZone.Models.Dtos.User;
using TrainingZone.Models.WebSocket;
using TrainingZone.Repositories;
using TrainingZone.WebSocketAdministration;

namespace TrainingZone.Services;

public class ChatService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly WebSocketNetwork _webSocketNetwork;
    private readonly UserMapper _userMapper;

    public ChatService(UnitOfWork unitOfWork, WebSocketNetwork webSocketNetwork, UserMapper userMapper)
    {
        _unitOfWork = unitOfWork;
        _webSocketNetwork = webSocketNetwork;
        _userMapper = userMapper;
    }

    internal async Task<Chat> GetChatAsync(int userId, int userDestinationId)
    {
        return await _unitOfWork.ChatRepository.GetChatByUserIdAndUserDestinationIdAsync(userId, userDestinationId);
    }

    internal async Task HandleMessage(int userId, string message)
    {
        SocketMessage<SocketChatMessage> recived = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage>>(message);

        switch (recived.Data.ChatRequestType)
        {
            case ChatRequestType.ALL_USERS_WITH_CONVERSATION:

                try
                {
                    WebSocketHandler handler = _webSocketNetwork.GetSocketByUserId(userId);

                    List<User> users = await _unitOfWork.ChatRepository.GetAllUsersWithChatAsync(userId);

                    var messageToSend = new SocketMessage<SocketChatMessage<List<UserDto>>>()
                    {
                        Type = SocketCommunicationType.CHAT,
                        Data = new SocketChatMessage<List<UserDto>>()
                        {
                            ChatRequestType = ChatRequestType.ALL_USERS_WITH_CONVERSATION,
                            Data = _userMapper.ToDto(users)
                        }
                    };

                    await handler.SendAsync(JsonSerializer.Serialize(messageToSend));
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }

                break;

            case ChatRequestType.CONVERSATION:


                try
                {
                    WebSocketHandler handler = _webSocketNetwork.GetSocketByUserId(userId);

                    SocketChatMessage<int> getChatRequest = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage<int>>>(message).Data;

                    Chat userChat = await _unitOfWork.ChatRepository.GetChatByUserIdAndUserDestinationIdAsync(userId, getChatRequest.Data);

                    var messageToSend = new SocketMessage<SocketChatMessage<Chat>>()
                    {
                        Type = SocketCommunicationType.CHAT,
                        Data = new SocketChatMessage<Chat>()
                        {
                            ChatRequestType = ChatRequestType.CONVERSATION,
                            Data = userChat
                        }
                    };

                    await handler.SendAsync(JsonSerializer.Serialize(messageToSend));
                }

                catch (Exception e)
                {
                    Console.WriteLine(e);
                }

                break;
            case ChatRequestType.SEND:
                MessageReceived sendMessageRequest = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage<MessageReceived>>>(message).Data.Data;


                try
                {
                    //If chat doesn´t exist, crete it

                    Chat chat = await _unitOfWork.ChatRepository.GetChatByUserIdAndUserDestinationIdAsync(userId, sendMessageRequest.UserId);

                    if(chat == null)
                    {
                        chat = new Chat
                        {
                            UserOriginId = userId,
                            UserDestinationId = sendMessageRequest.UserId,
                        };

                        _unitOfWork.ChatRepository.Add(chat);
                        await _unitOfWork.SaveAsync();
                    }

                    //Save the Message
                    ChatMessage newMessage = new ChatMessage
                    {
                        ChatId = chat.Id,
                        UserId = userId,
                        Message = sendMessageRequest.Message,
                        MessageDateTime = DateTime.Now,

                    };
                    _unitOfWork.ChatMessageRepository.Add(newMessage);
                    await _unitOfWork.SaveAsync();

                    //Send to user destination
                    WebSocketHandler handler = _webSocketNetwork.GetSocketByUserId(sendMessageRequest.UserId);

                    if (handler == null)
                        return;

                    var messageToSend = new SocketMessage<SocketChatMessage<MessageReceived>>()
                    {
                        Type = SocketCommunicationType.CHAT,
                        Data = new SocketChatMessage<MessageReceived>()
                        {
                            ChatRequestType = ChatRequestType.CONVERSATION,
                            Data = new MessageReceived
                            {
                                Message = sendMessageRequest.Message,
                                UserId = userId
                            }
                        }
                    };

                    await handler.SendAsync(JsonSerializer.Serialize(messageToSend));


                }

                catch (Exception e)
                {
                    Console.WriteLine(e);
                }




                break;
            case ChatRequestType.MODIFY:
                SocketMessage<SocketChatMessage> ModifyMessageRequest = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage>>(message);



                break;
            case ChatRequestType.DELETE:
                SocketMessage<SocketChatMessage> deleteMessageRequest = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage>>(message);



                break;
        }

    }
}
