using TrainingZone.Models.Dtos.User;

namespace TrainingZone.Models.Dtos.Trainer;

public class AllTrainersDto
{
    public int TotalPages { get; set; }
    public List<TrainerDto> AllTrainers { get; set; } = new List<TrainerDto>();
}
