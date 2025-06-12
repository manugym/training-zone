using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrainingZone.Models.DataBase;
using TrainingZone.Services;

namespace TrainingZone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {

        private ClassService _classService;

        public ClassController (ClassService classService)
        {
            _classService = classService;
        }


        [HttpGet("{id}")]
        public async Task<Class> GetClassById(int id)
        {
            Class activity = await _classService.GetClassById(id);

            if(activity == null)
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                return null;
            }

            return activity;
        }

        [HttpGet("getAll")]
        public async Task<List<Class>> GetAllClasses()
        {
            List<Class> activities = await _classService.GetAllClassesAsync();

            return activities;
        }
    }
}
