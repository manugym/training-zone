namespace TrainingZone.MiddleWares;

public class WebSocketMiddleWare : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // Verificar si la solicitud es un WebSocket
        if (!context.WebSockets.IsWebSocketRequest)
        {
            await next(context);
            return;
        }


        //Obtiene el jwt de la ruta
        string jwt = context.Request.Query["jwt"].ToString();

        Console.WriteLine(jwt);

        if (string.IsNullOrEmpty(jwt))
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
        }


        //Lo introduce en el header para que el Websocket pueda leerlo 
        context.Request.Headers["Authorization"] = $"Bearer {jwt}";


        //Paso a método tipo get

        context.Request.Method = "GET";

        await next(context);


    }
}
