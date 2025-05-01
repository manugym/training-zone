using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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


}
