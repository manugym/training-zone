using TrainingZone.Models.Enums;

namespace TrainingZone.Models.Dtos.User;

public class ChangeUserRoleRequest
{
    public int UserId { get; set; }
    public Role Role { get; set; }

}
