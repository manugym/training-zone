using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Chat;
using TrainingZone.Models.Dtos.User;

namespace TrainingZone.Mappers;

public class ChatMapper
{
    private readonly UserMapper _userMapper;

    public ChatMapper(UserMapper userMapper)
    {
        _userMapper = userMapper;
    }

    public ChatDto ToDto(Chat chat)
    {
        return new ChatDto
        {
            Id = chat.Id,
            UserOriginId = chat.UserOriginId,
            UserDestinationId = chat.UserDestinationId,
            UserOrigin = _userMapper.ToDto(chat.UserOrigin),
            UserDestination = _userMapper.ToDto(chat.UserDestination),
            ChatMessages = chat.ChatMessages,
        };
    }

    public List<ChatDto> ToDto(List<Chat> chats)
    {
        return chats?.Select(ToDto).ToList() ?? new List<ChatDto>();
    }

}
