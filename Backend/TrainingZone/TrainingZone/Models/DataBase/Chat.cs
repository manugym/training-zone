namespace TrainingZone.Models.DataBase;

public class Chat
{
    public int Id { get; set; }
    public int UserOriginId { get; set; }
    public int UserDestinationId { get; set; }


    public List<ChatMessage> ChatMessages { get; set; }
}
