using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Requests;
using TrainingZone.Services;

namespace TrainingZone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<string>> RegisterUserAsync([FromForm] NewUserRequest receivedUser)
        {
            User newUser = await _authService.RegisterUser(receivedUser);
            if (newUser != null)
            {
                string stringToken = _authService.ObtainToken(newUser);
                return Ok(new
                {
                    accessToken = stringToken
                });
            }
            else
            {
                return Unauthorized();
            }
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<string>> LoginUser([FromBody] LoginRequest userLogin)
        {

            User user = await _authService.GetUserByCredentialAndPassword(userLogin.Credential, userLogin.Password);
            if (user != null)
            {
                string stringToken = _authService.ObtainToken(user);
                return Ok(new
                {
                    accessToken = stringToken
                });
            }
            else
            {
                return Unauthorized();
            }

        }
        

    }
}
