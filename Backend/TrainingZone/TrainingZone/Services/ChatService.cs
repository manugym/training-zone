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

                    int destinationUserId = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage<int>>>(message).Data.Data;
                    Chat userChat = await _unitOfWork.ChatRepository.GetChatByUserIdAndUserDestinationIdAsync(userId, destinationUserId);

                    //If there are unread messages, mark them as read
                    var unreadMessages = userChat.ChatMessages
                        .Where(message => message.UserId == destinationUserId && !message.IsViewed)
                        .ToList();

                    foreach (var chatMessage in unreadMessages)
                    {
                        chatMessage.IsViewed = true;
                        _unitOfWork.ChatMessageRepository.Update(chatMessage);

                    }

                    await _unitOfWork.SaveAsync();


                    var messageToSend = new SocketMessage<SocketChatMessage<Chat>>()
                    {
                        Type = SocketCommunicationType.CHAT,
                        Data = new SocketChatMessage<Chat>()
                        {
                            ChatRequestType = ChatRequestType.CONVERSATION,
                            Data = userChat
                        }
                    };

                    //Send the conversation to both users if they are online
                    await _webSocketNetwork.GetSocketByUserId(userId)?.SendAsync(JsonSerializer.Serialize(messageToSend));
                    await _webSocketNetwork.GetSocketByUserId(destinationUserId)?.SendAsync(JsonSerializer.Serialize(messageToSend));
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
                            ChatRequestType = ChatRequestType.SEND,
                            Data = newMessage
                        }
                    };

                   
                    await _webSocketNetwork.GetSocketByUserId(userId)?.SendAsync(JsonSerializer.Serialize(messageToSend));
                    await _webSocketNetwork.GetSocketByUserId(sendMessageRequest.UserId)?.SendAsync(JsonSerializer.Serialize(messageToSend));
                }

                catch (Exception e)
                {
                    Console.WriteLine(e);
                }



                break;
            case ChatRequestType.MODIFY:

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
                            ChatRequestType = ChatRequestType.MODIFY,
                            Data = chatMessage
                        }
                    };

                    Chat currentChat = await _unitOfWork.ChatRepository.GetByIdAsync(chatMessage.ChatId);

                    await _webSocketNetwork.GetSocketByUserId(userId)?
                        .SendAsync(JsonSerializer.Serialize(messageToSend));
                    await _webSocketNetwork.GetSocketByUserId(currentChat.UserOriginId == userId ? currentChat.UserDestinationId : currentChat.UserOriginId)?
                        .SendAsync(JsonSerializer.Serialize(messageToSend));

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }

                break;
            case ChatRequestType.DELETE:
                SocketMessage<SocketChatMessage> deleteMessageRequest = JsonSerializer.Deserialize<SocketMessage<SocketChatMessage>>(message);



                break;
        }

    }
}
