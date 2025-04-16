namespace TrainingZone.Models.Dtos;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public string? AvatarImageUrl { get; set; }
}
