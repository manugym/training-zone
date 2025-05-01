using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrainingZone.Models.DataBase;
using TrainingZone.Services;

namespace TrainingZone.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ChatController : ControllerBase
{

    private readonly ChatService _chatService;

    public ChatController(ChatService chatService)
    {
        _chatService = chatService;
    }

    [Authorize]
    [HttpGet("{userDestinationId}")]
    public async Task<Chat> GetChatAsync(int userDestinationId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !long.TryParse(userId, out var userIdLong))
        {
            HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return null;
        }

        return await _chatService.GetChatAsync(Int32.Parse(userId), userDestinationId);


    }

}
