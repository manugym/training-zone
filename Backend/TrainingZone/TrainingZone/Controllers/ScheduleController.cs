using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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

        [HttpGet("getAllByClass{id}")]
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

        [HttpPost("create")]
        public async Task<IActionResult> CreateNewSchedule([FromBody]CreateScheduleDto createScheduleDto)
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

            return Ok(newSchedule);
        }

        [HttpDelete("{scheduleId}")]
        public async Task<IActionResult> DeleteScheduleById(int scheduleId)
        {
            ScheduleDto deleteSchedule = await _scheduleService.DeleteScheduleById(scheduleId);
        
            if(deleteSchedule == null)
            {
                return NotFound("No se encontró el horario a eliminar");
            }

            return Ok(deleteSchedule);
        }

        [HttpPut("{scheduleId}")]
        public async Task<IActionResult> UpdateSchedule(int scheduleId, [FromBody]UpdateScheduleDto updateData)
        {
            if(updateData == null)
            {
                return BadRequest();
            }

            Schedule schedule = await _scheduleService.GetScheduleById(scheduleId);

            if(schedule == null)
            {
                return NotFound("No se encontró el horario a actualizar");
            }

            ScheduleDto updatedSchedule = await _scheduleService.UpdateSchedule(scheduleId, updateData);

            if(updatedSchedule == null)
            {
                return NotFound("No se pudo actualizar el horario");
            }

            return Ok(updatedSchedule);
        }
    }
}
