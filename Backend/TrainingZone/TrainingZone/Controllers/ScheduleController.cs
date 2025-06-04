using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Schedule;
using TrainingZone.Services;

namespace TrainingZone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {

        private ScheduleService _scheduleService;

        public ScheduleController (ScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        [HttpGet("{id}")]
        public async Task<IEnumerable<ScheduleDto>> GetScheduleByClass(int id)
        {
            IEnumerable<ScheduleDto> schedule = await _scheduleService.GetScheduleByClass(id);

            if(schedule == null)
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                return null;
            }

            return schedule;
        }

        [HttpPost]
        public async Task<ActionResult<ScheduleDto>> CreateNewSchedule(CreateScheduleDto createScheduleDto)
        {
            if(createScheduleDto == null)
            {
                return BadRequest("Los datos enviados no son correctos.");
            }

            ScheduleDto newSchedule = await _scheduleService.CreateSchedule(createScheduleDto);

            if(newSchedule == null)
            {
                return StatusCode(500, "No se pudo crear el horario");
            }

            return newSchedule;
        }
    }
}
