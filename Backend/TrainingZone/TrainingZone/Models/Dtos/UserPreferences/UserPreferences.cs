using TrainingZone.Models.Enums.UserPreferences;

namespace TrainingZone.Models.Dtos.UserPreferences;

public class UserPreferences
{
    public int Age { get; set; }
    public UserGender Gender { get; set; }
    public double HeightCm { get; set; }
    public double WeightKg { get; set; }
    public UserGoal Goal { get; set; }
    public UserLevel Level { get; set; }
    public int DaysPerWeek { get; set; }
    public UserPreferredActivities PreferredActivities { get; set; }
}
