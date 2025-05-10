using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text.Json;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.User;
using TrainingZone.Models.WebSocket;
using TrainingZone.Services;

namespace TrainingZone.WebSocketAdministration;

public class WebSocketNetwork
{


    //Diccionario de conexiones, almacena el id del usuario y el websocket de su conexión
    private ConcurrentDictionary<int, WebSocketHandler> _handlers = new ConcurrentDictionary<int, WebSocketHandler>();

    private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

    private readonly IServiceProvider _serviceProvider;

    public WebSocketNetwork(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }


    public async Task HandleAsync(UserDto user, WebSocket webSocket)
    {
        // Creamos un nuevo WebSocketHandler a partir del WebSocket recibido y lo añadimos a la lista
        WebSocketHandler handler = await AddWebsocketAsync(user, webSocket);

        // Esperamos a que el WebSocketHandler termine de manejar la conexión
        await handler.HandleAsync();

    }

    private async Task<WebSocketHandler> AddWebsocketAsync(UserDto user, WebSocket webSocket)
    {

        // Esperamos a que haya un hueco disponible
        await _semaphore.WaitAsync();

        // Sección crítica
        // Creamos un nuevo WebSocketHandler, nos suscribimos a sus eventos y lo añadimos a la lista
        WebSocketHandler newHandler = new WebSocketHandler(user.Id, webSocket);
        newHandler.Disconnected += OnDisconnectedAsync;
        newHandler.MessageReceived += OnMessageReceivedAsync;
        _handlers.TryAdd(user.Id, newHandler);

        // Liberamos el semáforo
        _semaphore.Release();



        Console.WriteLine("Usuario " + user.Id + " conectado");

        return newHandler;

    }

    private async Task OnDisconnectedAsync(WebSocketHandler disconnectedHandler)
    {
        // Esperamos a que haya un hueco disponible
        await _semaphore.WaitAsync();

        // Sección crítica
        // Nos desuscribimos de los eventos y eliminamos el WebSocketHandler de la lista
        disconnectedHandler.Disconnected -= OnDisconnectedAsync;
        disconnectedHandler.MessageReceived -= OnMessageReceivedAsync;
        _handlers.TryRemove(disconnectedHandler.Id, out disconnectedHandler);

        // Liberamos el semáforo
        _semaphore.Release();




        Console.WriteLine("Usuario " + disconnectedHandler.Id + " desconectado");

    }

    private async Task OnMessageReceivedAsync(WebSocketHandler webSocketHandler, string message)
    {
        //Servicios necesarios
        using var scope = _serviceProvider.CreateScope();
        var chatService = scope.ServiceProvider.GetRequiredService<ChatService>();

        //Identifica el tipo de mensaje y lo envia a su respectivo servicio
        SocketMessage recived = JsonSerializer.Deserialize<SocketMessage>(message);

        switch (recived.Type)
        {
            case SocketCommunicationType.CHAT:
                await chatService.HandleMessage(webSocketHandler.Id,message);
                break;
        }

        


    }

    public WebSocketHandler GetSocketByUserId(int id)
    {
        return _handlers.FirstOrDefault(p => p.Key == id).Value;
    }


}