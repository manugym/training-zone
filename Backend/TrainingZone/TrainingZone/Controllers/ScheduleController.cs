using Microsoft.AspNetCore.Authorization;
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

        public ScheduleController(ScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        [HttpGet("getAllByClass{id}")]
        public async Task<IEnumerable<ScheduleDto>> GetScheduleByClass(int id)
        {
            IEnumerable<ScheduleDto> schedule = await _scheduleService.GetScheduleByClass(id);

            if (schedule == null)
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                return null;
            }

            return schedule;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateNewSchedule([FromBody] CreateScheduleDto createScheduleDto)
        {
            if (createScheduleDto == null)
            {
                return BadRequest("Los datos enviados no son correctos.");
            }

            ScheduleDto newSchedule = null;

            try
            {
                newSchedule = await _scheduleService.CreateSchedule(createScheduleDto);
            }
            catch (InvalidOperationException ex)
            {
                return Forbid(ex.Message);
            }


            if (newSchedule == null)
            {
                return StatusCode(500, "No se pudo crear el horario");
            }

            return Ok(newSchedule);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{scheduleId}")]
        public async Task<IActionResult> DeleteScheduleById(int scheduleId)
        {
            ScheduleDto deleteSchedule = await _scheduleService.DeleteScheduleById(scheduleId);

            if (deleteSchedule == null)
            {
                return NotFound("No se encontró el horario a eliminar");
            }

            return Ok(deleteSchedule);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{scheduleId}")]
        public async Task<IActionResult> UpdateSchedule(int scheduleId, [FromBody] UpdateScheduleDto updateData)
        {
            if (updateData == null)
            {
                return BadRequest();
            }

            Schedule schedule = await _scheduleService.GetScheduleById(scheduleId);

            if (schedule == null)
            {
                return NotFound("No se encontró el horario a actualizar");
            }

            ScheduleDto updatedSchedule = null;

            try
            {
                updatedSchedule = await _scheduleService.UpdateSchedule(scheduleId, updateData);
            } catch(InvalidOperationException ex)
            {
                return Forbid(ex.Message);
            }
            

            if (updatedSchedule == null)
            {
                return NotFound("No se pudo actualizar el horario");
            }

            return Ok(updatedSchedule);
        }

        [HttpGet("byDate")]
        public async Task<ActionResult<IEnumerable<ScheduleDto>>> GetSchedulesByDateAndClass([FromQuery] int classId, [FromQuery] DateOnly date)
        {
            IEnumerable<ScheduleDto> scheduleByClassAndDate = await _scheduleService.getAllScheduleByDate(classId, date);

            if (scheduleByClassAndDate == null)
            {
                return NotFound("No se encontró horario en la fecha indicada.");
            }

            return Ok(scheduleByClassAndDate);
        }
    }
}
