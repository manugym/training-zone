using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrainingZone.Models.DataBase;
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

    [HttpGet]
    public async Task<List<User>> GetTrainers([FromBody] )
    {



    }

    



}
