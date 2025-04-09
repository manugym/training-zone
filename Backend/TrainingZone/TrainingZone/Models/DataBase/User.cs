using Microsoft.EntityFrameworkCore;

namespace TrainingZone.Models.DataBase;

[Index(nameof(Email), IsUnique = true)]
[Index(nameof(Phone), IsUnique = true)]

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
    public string? AvatarImageUrl { get; set; }
    
}
