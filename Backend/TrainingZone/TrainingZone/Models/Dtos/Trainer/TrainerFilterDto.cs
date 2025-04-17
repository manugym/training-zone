using TrainingZone.Enums;

namespace TrainingZone.Models.Dtos.Trainer;

public class TrainerFilterDto
{
    public ClassType? ClassType { get; set; }
    public string Name { get; set; }
    public int EntitiesPerPage { get; set; }
    public int ActualPage { get; set; }

}
