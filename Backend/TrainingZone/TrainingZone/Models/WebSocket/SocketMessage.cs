namespace TrainingZone.Models.WebSocket;

public class SocketMessage
{
    public virtual SocketCommunicationType Type { get; set; }
}

public class SocketMessage<T> : SocketMessage
{
    public T Data { get; set; }
}
