using TrainingZone.Models.Dtos.UserPreferences;
using QuestPDF.Fluent;
using OpenAI.Chat;
using TrainingZone.Models.Enums.UserPreferences;

namespace TrainingZone.Services;

public class RoutineGeneratorService
{

    private readonly string _apiKey;

    public RoutineGeneratorService(IConfiguration configuration)
    {
        _apiKey = configuration["OpenAi:Key"];
    }

    public async Task<byte[]> GenerateRoutine(UserPreferences userPreferences)
    {

        var model = "gpt-4o"; 

        var client = new ChatClient(model, _apiKey);

        var response = await client.CompleteChatAsync(BuildPrompt(userPreferences));

        return GeneratePdf(response.Value.Content[0].Text);
    }

    private string BuildPrompt(UserPreferences userPreferences)
    {
        var goalText = userPreferences.Goal switch
        {
            UserGoal.LoseWeight => "lose weight",
            UserGoal.BuildMuscle => "build muscle",
            UserGoal.ImproveEndurance => "improve endurance",
            UserGoal.MaintainHealth => "maintain overall health",
            UserGoal.GainStrength => "gain strength",
            _ => userPreferences.Goal.ToString()
        };


        return $@"
            You are a certified personal trainer. Create a {userPreferences.DaysPerWeek} days per week gym workout routine for a {userPreferences.Gender.ToString().ToLower()}, {userPreferences.Age} years old, {userPreferences.HeightCm} cm tall, weighing {userPreferences.WeightKg} kg.
            Their main goal is to {goalText}, and they have a {userPreferences.Level.ToString().ToLower()} experience level. They prefer these activities: {userPreferences.PreferredActivities.ToString()}.
            The client has approximately {userPreferences.TimeToTrainMinutes} minutes available to train each day.

            Present the routine organized by day. For each day, provide a concise title indicating the muscle groups worked. Then, list the exercises with sets and repetitions in the format 'Exercise Name - sets x reps'.
            At the end of each day, include recommended rest periods between sets in a brief sentence.

            Use simple, clear, and motivating language, avoiding technical jargon. Structure the routine to be easy to read and follow.

            Respond fully in {userPreferences.Language}.
            ";

    }


    private byte[] GeneratePdf(string text)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(50);
                page.Content().Column(col =>
                {
                    col.Item().PaddingBottom(50).Text("Training Zone Routine")
                        .FontSize(20)
                        .Bold()
                        .AlignCenter();

                    col.Item().Text(text).FontSize(14);
                });
            });
        }).GeneratePdf();
    }

   
}
