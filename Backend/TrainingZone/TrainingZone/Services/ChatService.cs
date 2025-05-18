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
    private readonly ChatMapper _chatMapper;

    public ChatService(UnitOfWork unitOfWork, WebSocketNetwork webSocketNetwork, ChatMapper chatMapper)
    {
        _unitOfWork = unitOfWork;
        _webSocketNetwork = webSocketNetwork;
        _chatMapper = chatMapper;

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
            case ChatRequestType.ALL_CHATS:

                try
                {
                    WebSocketHandler handler = _webSocketNetwork.GetSocketByUserId(userId);

                    List<Chat> allChats = await _unitOfWork.ChatRepository.GetAllChatsByUserIdAsync(userId);

                    var messageToSend = new SocketMessage<SocketChatMessage<List<ChatDto>>>()
                    {
                        Type = SocketCommunicationType.CHAT,
                        Data = new SocketChatMessage<List<ChatDto>>()
                        {
                            ChatRequestType = ChatRequestType.ALL_CHATS,
                            Data = _chatMapper.ToDto(allChats)
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
                    int destinationUserId = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage<int>>>(message).Data.Data;


                    Chat chat = await _unitOfWork.ChatRepository.GetChatByUserIdAndUserDestinationIdAsync(userId, destinationUserId);

                    if (chat == null)
                        return;


                    List<ChatMessage> notViewedMessages = chat.ChatMessages
                        .Where(m => !m.IsViewed && m.UserId != userId)
                        .ToList();

                    foreach (var chatMessage in notViewedMessages)
                    {
                        chatMessage.IsViewed = true;
                        _unitOfWork.ChatMessageRepository.Update(chatMessage);
                    }

                    await _unitOfWork.SaveAsync();

                    var messageToSend = new SocketMessage<SocketChatMessage<ChatDto>>()
                    {
                        Type = SocketCommunicationType.CHAT,
                        Data = new SocketChatMessage<ChatDto>()
                        {
                            ChatRequestType = ChatRequestType.CONVERSATION,
                            Data = _chatMapper.ToDto(chat)
                        }
                    };

                    var currentSocket = _webSocketNetwork.GetSocketByUserId(userId);

                    if (currentSocket != null)
                    {
                        await currentSocket.SendAsync(JsonSerializer.Serialize(messageToSend));
                    }

                    var destinationSocket = _webSocketNetwork.GetSocketByUserId(destinationUserId);

                    if (destinationSocket != null)
                    {
                        await destinationSocket.SendAsync(JsonSerializer.Serialize(messageToSend));
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }

                break;

            case ChatRequestType.SEND_MESSAGE:
                MessageReceived sendMessageRequest = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage<MessageReceived>>>(message).Data.Data;


                try
                {
                    //If the chat doesn´t exist, crete it
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


                    //If everything went well, the message is sent to the users if they are connected.
                    var messageToSend = new SocketMessage<SocketChatMessage<ChatMessage>>()
                    {
                        Type = SocketCommunicationType.CHAT,
                        Data = new SocketChatMessage<ChatMessage>()
                        {
                            ChatRequestType = ChatRequestType.SEND_MESSAGE,
                            Data = newMessage
                        }
                    };


                    var currentSocket = _webSocketNetwork.GetSocketByUserId(userId);

                    if (currentSocket != null)
                    {
                        await currentSocket.SendAsync(JsonSerializer.Serialize(messageToSend));
                    }

                    var destinationSocket = _webSocketNetwork.GetSocketByUserId(sendMessageRequest.UserId);

                    if (destinationSocket != null)
                    {
                        await destinationSocket.SendAsync(JsonSerializer.Serialize(messageToSend));
                    }
                }

                catch (Exception e)
                {
                    Console.WriteLine(e);
                }



                break;
            case ChatRequestType.MODIFY_MESSAGE:

                try
                {
                    ModifyChatMessage modifyMessageRequest = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage<ModifyChatMessage>>>(message).Data.Data;

                    ChatMessage chatMessage = await _unitOfWork.ChatMessageRepository.GetByIdAsync(modifyMessageRequest.Id);

                    //If the data is correct, update the message
                    if (chatMessage == null)
                        return;

                    if (modifyMessageRequest.IsViewed != null)
                        chatMessage.IsViewed = modifyMessageRequest.IsViewed.Value;

                    if (modifyMessageRequest.Message != null)
                        chatMessage.Message = modifyMessageRequest.Message;

                    _unitOfWork.ChatMessageRepository.Update(chatMessage);
                    await _unitOfWork.SaveAsync();

                    //Send changes to users
                    var messageToSend = new SocketMessage<SocketChatMessage<ChatMessage>>()
                    {
                        Type = SocketCommunicationType.CHAT,
                        Data = new SocketChatMessage<ChatMessage>()
                        {
                            ChatRequestType = ChatRequestType.MODIFY_MESSAGE,
                            Data = chatMessage
                        }
                    };

                    Chat currentChat = await _unitOfWork.ChatRepository.GetByIdAsync(chatMessage.ChatId);

                    var currentSocket = _webSocketNetwork.GetSocketByUserId(userId);

                    if (currentSocket != null)
                    {
                        await currentSocket.SendAsync(JsonSerializer.Serialize(messageToSend));
                    }

                    var destinationSocket = _webSocketNetwork.GetSocketByUserId(currentChat.UserOriginId == userId ? currentChat.UserDestinationId : currentChat.UserOriginId);

                    if (destinationSocket != null)
                    {
                        await destinationSocket.SendAsync(JsonSerializer.Serialize(messageToSend));
                    }


                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }

                break;
            case ChatRequestType.DELETE_MESSAGE:
                int messageId = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage<int>>>(message).Data.Data;

                try
                {
                    ChatMessage messageToDelete = await _unitOfWork.ChatMessageRepository.GetByIdAsync(messageId);

                    if(messageToDelete == null)
                        return;

                    _unitOfWork.ChatMessageRepository.Delete(messageToDelete);
                    await _unitOfWork.SaveAsync();

                    var messageToSend = new SocketMessage<SocketChatMessage<int>>()
                    {
                        Type = SocketCommunicationType.CHAT,
                        Data = new SocketChatMessage<int>()
                        {
                            ChatRequestType = ChatRequestType.DELETE_MESSAGE,
                            Data = messageId
                        }
                    };

                    var currentSocket = _webSocketNetwork.GetSocketByUserId(userId);

                    if (currentSocket != null)
                    {
                        await currentSocket.SendAsync(JsonSerializer.Serialize(messageToSend));
                    }

                    Chat currentChat = await _unitOfWork.ChatRepository.GetByIdAsync(messageToDelete.ChatId);

                    var destinationSocket = _webSocketNetwork.GetSocketByUserId(currentChat.UserOriginId == userId ? currentChat.UserDestinationId : currentChat.UserOriginId);

                    if (destinationSocket != null)
                    {
                        await destinationSocket.SendAsync(JsonSerializer.Serialize(messageToSend));
                    }

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }

                break;
        }

    }
}
