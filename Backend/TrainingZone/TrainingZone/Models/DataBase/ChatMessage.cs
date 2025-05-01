namespace TrainingZone.Models.DataBase;

public class ChatMessage
{
    public int Id { get; set; }
    public int ChatId { get; set; }
    public string Message { get; set; }
    public DateTime MessageDateTime { get; set; }


    public Chat Chat { get; set; }

}
