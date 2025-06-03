using TrainingZone.Models.Dtos.UserPreferences;

namespace TrainingZone.Services;

public class RoutineGeneratorService
{
    private readonly string _openAiKey;

    public RoutineGeneratorService(IConfiguration configuration)
    {
        _openAiKey = configuration["OpenAi:Key"];
    }

    internal async Task<byte[]> GenerateRoutine(UserPreferences userDetails)
    {
        throw new NotImplementedException();
    }
}
