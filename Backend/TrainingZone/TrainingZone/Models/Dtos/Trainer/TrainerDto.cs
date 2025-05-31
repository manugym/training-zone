using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.User;

namespace TrainingZone.Models.Dtos.Trainer;

public class TrainerDto
{
    public UserDto User { get; set; }
    public List<Class> TrainerClasses { get; set; } = new List<Class>();
}
