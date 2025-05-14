namespace TrainingZone.Models.Dtos.Chat;

public class ModifyChatMessage
{
    public int Id { get; set; }
    public string? Message { get; set; }
    public bool? IsViewed { get; set; } = false;
}
