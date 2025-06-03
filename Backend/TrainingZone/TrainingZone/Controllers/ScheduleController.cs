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
    }
}
