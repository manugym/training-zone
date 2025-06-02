using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.User;

namespace TrainingZone.Models.Dtos.Chat;

public class ChatDto
{
    public int Id { get; set; }
    public int UserOriginId { get; set; }
    public int UserDestinationId { get; set; }


    public List<ChatMessage> ChatMessages { get; set; }
    public UserDto UserOrigin { get; set; }
    public UserDto UserDestination { get; set; }
}
