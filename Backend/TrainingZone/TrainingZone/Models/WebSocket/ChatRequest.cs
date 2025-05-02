namespace TrainingZone.Models.WebSocket;

public class ChatRequest
{
    public virtual ChatRequestType ChatRequestType { get; set; }
}
public class GetChatRequest : ChatRequest
{
    public override ChatRequestType ChatRequestType => ChatRequestType.GET_CHAT;
    public int UserId { get; set; }
}

public class SendChatMessageRequest : ChatRequest
{
    public override ChatRequestType ChatRequestType => ChatRequestType.SEND;
    public int DestinationUserId { get; set; }
    public string Message { get; set; }

}

public class ModifyChatMessageRequest : ChatRequest
{
    public override ChatRequestType ChatRequestType => ChatRequestType.MODIFY;
    public int MessageId { get; set; }
    public string NewMessage { get; set; }

}

public class DeleteChatMessageRequest : ChatRequest
{
    public override ChatRequestType ChatRequestType => ChatRequestType.DELETE;
    public int MessageId { get; set; }

}



