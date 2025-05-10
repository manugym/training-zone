import { BehaviorSubject, Subscription } from "rxjs";
import {
  ChatRequestBase,
  ChatRequestGeneric,
} from "../models/websocket/chat-request";
import { SocketMessageGeneric } from "../models/websocket/socket-message";
import websocketService from "./websocket.service";
import { SocketCommunicationType } from "../models/enums/socket-communication-type";
import { ChatRequestType } from "../models/enums/chat-request-type";
import { User } from "../models/user";
import { Chat } from "../models/chat";
import { SendMessageRequest } from "../models/send-message-request";
import userService from "./user.service";
import { ChatMessage } from "../models/chat_message";

class ChatService {
  private _usersWithConversations = new BehaviorSubject<User[] | null>(null);
  //observable that can be used outside of the service
  public usersWithConversations$ = this._usersWithConversations.asObservable();

  private _actualConversation = new BehaviorSubject<Chat | null>(null);
  public actualConversation$ = this._actualConversation.asObservable();

  messageReceived$: Subscription;

  constructor() {
    this.messageReceived$ = websocketService.messageReceived.subscribe(
      async (message) => await this.readMessage(message)
    );
  }

  private async readMessage(message: string): Promise<void> {
    try {
      // Paso del mensaje a objeto
      const parsedMessage = JSON.parse(message);

      const socketMessage = new SocketMessageGeneric<any>();
      socketMessage.Type = parsedMessage.Type as SocketCommunicationType;
      socketMessage.Data = parsedMessage.Data;

      this.handleSocketMessage(socketMessage);
    } catch (error) {
      console.error("Error al parsear el mensaje recibido:", error);
    }
  }

  private handleSocketMessage(message: SocketMessageGeneric<any>): void {
    switch (message.Type) {
      case SocketCommunicationType.CHAT:
        console.log("Mensaje de chat recibido:", message.Data);

        switch (message.Data.ChatRequestType) {
          case ChatRequestType.ALL_USERS_WITH_CONVERSATION:
            this._usersWithConversations.next(message.Data.Data);

            break;
          case ChatRequestType.CONVERSATION:
            this._actualConversation.next(message.Data.Data);

            break;
          case ChatRequestType.SEND:
            const newMessage: ChatMessage = message.Data.Data;
            console.log("mensaje recibido : ", newMessage);

            const currentConversation = this._actualConversation.getValue();

            if (
              currentConversation?.UserDestinationId === newMessage.UserId ||
              currentConversation?.UserOriginId === newMessage.UserId
            ) {
              const updatedConversation = {
                ...currentConversation,
                ChatMessages: [
                  ...(currentConversation.ChatMessages || []),
                  newMessage,
                ],
              };

              this._actualConversation.next(updatedConversation);
            }
            break;
          case ChatRequestType.MODIFY:
            break;
          case ChatRequestType.DELETE:
            break;
          default:
            console.error("Tipo de solicitud no reconocido");
        }
        break;
    }
  }

  async sendGetAllUsersWithChatRequest(): Promise<void> {
    const request: ChatRequestBase = {
      ChatRequestType: ChatRequestType.ALL_USERS_WITH_CONVERSATION,
    };

    const socketMessage = new SocketMessageGeneric<ChatRequestBase>();
    socketMessage.Type = SocketCommunicationType.CHAT;
    socketMessage.Data = request;

    websocketService.send(JSON.stringify(socketMessage));
  }

  async sendGetChatRequest(userId: number): Promise<void> {
    const request: ChatRequestGeneric<number> = {
      ChatRequestType: ChatRequestType.CONVERSATION,
      Data: userId,
    };

    const socketMessage = new SocketMessageGeneric<
      ChatRequestGeneric<number>
    >();
    socketMessage.Type = SocketCommunicationType.CHAT;
    socketMessage.Data = request;

    websocketService.send(JSON.stringify(socketMessage));
  }

  async sendMessage(message: string): Promise<void> {
    const currentUser = userService.getCurrentUser();

    const request: ChatRequestGeneric<SendMessageRequest> = {
      ChatRequestType: ChatRequestType.SEND,
      Data: {
        UserId:
          this._actualConversation.getValue()?.UserOriginId === currentUser.Id
            ? this._actualConversation.getValue()?.UserDestinationId
            : this._actualConversation.getValue()?.UserOriginId,

        Message: message,
      },
    };

    const socketMessage = new SocketMessageGeneric<
      ChatRequestGeneric<SendMessageRequest>
    >();
    socketMessage.Type = SocketCommunicationType.CHAT;
    socketMessage.Data = request;

    console.log("Envinado Mensaje ...", socketMessage);

    websocketService.send(JSON.stringify(socketMessage));
  }
}

export default new ChatService();
