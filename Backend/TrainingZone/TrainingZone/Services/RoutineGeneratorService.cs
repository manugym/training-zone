using TrainingZone.Models.Dtos.UserPreferences;
using QuestPDF.Fluent;

using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;

namespace TrainingZone.Services;

public class RoutineGeneratorService
{

    public RoutineGeneratorService(IConfiguration configuration)
    {
       
    }

    public async Task<byte[]> GenerateRoutine(UserPreferences userDetails)
    {
        return GeneratePdf("En proceso");
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
                    col.Item().Text("Rutina Generada por IA").FontSize(20).Bold();
                    col.Item().Text(text).FontSize(14);
                });
            });
        }).GeneratePdf();
    }

   
}
