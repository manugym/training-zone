import { Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import apiService from "./api.service";
import { Alert } from "react-native";
import { ServerUrl } from "@/constants/ServerUrl";

class WebSocketService {
  private readonly SOCKET_URL = `${ServerUrl}/socket`;

  connected = new Subject<void>();
  messageReceived = new Subject<any>();
  disconnected = new Subject<void>();

  private onConnected() {
    console.log("Socket connected");
    this.connected.next();
  }

  private onMessageReceived(message: string) {
    console.log("Message", message);
    this.messageReceived.next(message);
  }

  private onError(error: any) {
    console.error("Error:", error);
    this.disconnect();
    Alert.alert("Error", "Error de conexión");
    this.onDisconnected();
  }

  private onDisconnected() {
    console.log("WebSocket connection closed");
    this.disconnected.next();
  }

  rxjsSocket: WebSocketSubject<string>;

  isConnected() {
    return this.rxjsSocket && !this.rxjsSocket.closed;
  }

  async connect() {
    if (this.isConnected()) {
      console.log("Ya está conectado");
      return;
    }

    if (!this.isConnected() && apiService.jwt) {
      console.log(
        "Conectando a WebSocket",
        this.SOCKET_URL + "?jwt=" + apiService.jwt
      );

      this.rxjsSocket = webSocket({
        url: this.SOCKET_URL + "?jwt=" + apiService.jwt,

        // Evento de apertura de conexión
        openObserver: {
          next: () => this.onConnected(),
        },

        serializer: (value: string) => value,
        deserializer: (event: MessageEvent) => event.data,
      });

      this.rxjsSocket.subscribe({
        // Evento de mensaje recibido
        next: (message: string) => this.onMessageReceived(message),

        // Evento de error generado
        error: (error) => this.onError(error),

        // Evento de cierre de conexión
        complete: () => this.onDisconnected(),
      });
    }
  }

  send(message: string) {
    this.rxjsSocket.next(message);
  }

  disconnect() {
    this.rxjsSocket.complete();
    this.rxjsSocket = null;
    console.log("Desconectado");
  }
}

export default new WebSocketService();
