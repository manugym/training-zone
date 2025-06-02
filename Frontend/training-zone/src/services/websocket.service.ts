import { Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import Swal from "sweetalert2";
import apiService from "./api.service";

class WebSocketService {
  private readonly SOCKET_URL = `${import.meta.env.VITE_SERVER_URL}/socket`;

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

    Swal.fire({
      title: '<i class="fa-solid fa-chess-board"></i> ¡Error de conexión!',
      toast: true,
      position: "top-end",
      timer: 5000,
      timerProgressBar: true,
      background: "#301e16",
      color: "#E8D5B5",
      customClass: {
        popup: "rounded-lg shadow-lg",
        title: "font-bold text-lg",
        confirmButton:
          "bg-[#CBA77B] hover:bg-[#A68556] text-[#301e16] font-medium py-2 px-4 rounded-lg",
        cancelButton:
          "bg-[#CBA77B] hover:bg-[#A68556] text-[#301e16] font-medium py-2 px-4 rounded-lg",
        timerProgressBar: "bg-[#E8D5B5]",
      },
    }).then(() => {
      this.disconnect();
      this.onDisconnected();
    });
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
    if (!this.isConnected()) return;

    this.rxjsSocket.complete();
    this.rxjsSocket = null;
    console.log("Desconectado");
  }
}

export default new WebSocketService();
