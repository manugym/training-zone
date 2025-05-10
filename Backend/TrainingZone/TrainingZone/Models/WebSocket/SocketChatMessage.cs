namespace TrainingZone.Models.WebSocket;

public class SocketChatMessage
{
    public virtual ChatRequestType ChatRequestType { get; set; }
}
public class SocketChatMessage<T> : SocketChatMessage
{
    public T Data { get; set; }
}

