using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Trainer;
using TrainingZone.Models.Dtos.User;
using TrainingZone.Services;

namespace TrainingZone.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TrainerController : ControllerBase
{

    private TrainerService _trainerService;

    public TrainerController(TrainerService trainerService)
    {
        _trainerService = trainerService;
    }

    [HttpGet("{id}")]
    public async Task<TrainerDto> GetTrainerById(int id)
    {
        TrainerDto trainer = await _trainerService.GetTrainerById(id);
        if (trainer == null)
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }

        return trainer;
    }

    [HttpPost("allTrainers")]
    public async Task<AllTrainersDto> GetTrainersAsync([FromBody] TrainerFilterDto filter)
    {
        return await _trainerService.GetAllTrainersByFilterAsync(filter);
        
    }

}
