using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingZone.Models.Dtos.UserPreferences;
using TrainingZone.Services;

namespace TrainingZone.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoutineGenerator : ControllerBase
{

    RoutineGeneratorService _generatorService;

    public RoutineGenerator(RoutineGeneratorService generatorService)
    {
        _generatorService = generatorService;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> GenerateRoutine([FromBody] UserPreferences userDetails)
    {
        var pdfBytes = await _generatorService.GenerateRoutine(userDetails);

        return File(pdfBytes, "application/pdf", "RutinaGimnasio.pdf");
    }
}
