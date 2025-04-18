using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrainingZone.Mappers;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.User;
using TrainingZone.Services;

namespace TrainingZone.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{


    private UserService _userService;

    public UserController (UserService userService)
    {
        _userService = userService;
    }

    [Authorize]
    [HttpGet]
    public async Task<UserDto> GetAuthenticatedUser()
    {
        //Si no es una usuario autenticado termina la ejecución
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !long.TryParse(userId, out var userIdLong))
        {
            HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return null;
        }

        return await _userService.GetUserById(Int32.Parse(userId));


    }

    [Authorize]
    [HttpPut]
    public async Task<UserDto> UpdateAuthenticatedUser([FromForm] NewDataDto newData)
    {
        //Si no es una usuario autenticado termina la ejecución
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !long.TryParse(userId, out var userIdLong))
        {
            HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return null;
        }

        UserDto user = await _userService.UpdateUser(Int32.Parse(userId), newData);

        if (user == null) {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            return null;
               
        }


        return user;


    }



    [HttpGet("{id}")]
    public async Task<UserDto> GetUserById(int id)
    {
        UserDto user = await _userService.GetUserById(id);
        if(user == null)
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            return null;
        }

        return user;
    }




    [Authorize(Roles = "admin")]
    [HttpGet("/all")]
    public async Task<List<UserDto>> GetAllUsers()
    {
        return await _userService.GetAllUsers();

    }


    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<UserDto> DeleteUserById(int id)
    {
        UserDto user = await _userService.DeleteUserById(id);
        if (user == null)
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            return null;
        }

        return user;
    }



}
