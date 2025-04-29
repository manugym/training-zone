namespace TrainingZone.Models.Dtos.User;

public class NewDataDto
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public IFormFile? ImagePath { get; set; }
}
