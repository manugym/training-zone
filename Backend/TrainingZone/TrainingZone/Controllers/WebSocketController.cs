using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using System.Security.Claims;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.User;
using TrainingZone.Services;
using TrainingZone.WebSocketAdministration;

namespace TrainingZone.Controllers;

[Route("socket")]
[ApiController]
public class WebSocketController : ControllerBase
{
    private readonly WebSocketNetwork _websocketNetwork;
    private readonly UserService _userService;

    public WebSocketController(
        WebSocketNetwork websocketNetwork,
        UserService userService)
    {
        _websocketNetwork = websocketNetwork;
        _userService = userService;
    }

    [Authorize]
    [HttpGet]
    public async Task ConnectAsync()
    {

        //Si no es una usuario autenticado termina la ejecución
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !long.TryParse(userId, out var userIdLong))
        {
            HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        UserDto user = await _userService.GetUserById(Int32.Parse(userId));

        // Si la petición es de tipo websocket la aceptamos
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            // Aceptamos la solicitud
            WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();

            // Manejamos la solicitud.
            await _websocketNetwork.HandleAsync(user, webSocket);
        }
        // En caso contrario la rechazamos
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }


    }//Cierre de conexión


}

