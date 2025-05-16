import { BehaviorSubject, Subscription } from "rxjs";
import {
  ChatRequestBase,
  ChatRequestGeneric,
} from "../models/websocket/chat-request";
import { SocketMessageGeneric } from "../models/websocket/socket-message";
import websocketService from "./websocket.service";
import { SocketCommunicationType } from "../models/enums/socket-communication-type";
import { ChatRequestType } from "../models/enums/chat-request-type";
import { Chat } from "../models/chat";
import { SendMessageRequest } from "../models/send-message-request";
import userService from "./user.service";
import { ChatMessage } from "../models/chat-message";
import { ModifyChatMessage } from "../models/modify-chat-message";
import { User } from "../models/user";

class ChatService {
  private _allChats = new BehaviorSubject<Chat[] | null>(null);
  //observable that can be used outside of the service
  public allChats$ = this._allChats.asObservable();

  private _actualConversation = new BehaviorSubject<Chat | null>(null);
  public actualConversation$ = this._actualConversation.asObservable();

  messageReceived$: Subscription;

  constructor() {
    this.messageReceived$ = websocketService.messageReceived.subscribe(
      async (message) => await this.readMessage(message)
    );

    this.sendGetAllChatsRequest();
  }

  setActualConversation(chat: Chat | null): void {
    this._actualConversation.next(chat);
  }

  newConversation(user: User): void {
    const conversation = this._allChats.value.find(
      (chat) =>
        chat.UserOriginId === user.Id || chat.UserDestinationId === user.Id
    );

    if (conversation != null) {
      this._actualConversation.next(conversation);
      return;
    }

    const currentUser = userService.getCurrentUser();

    const newConversation: Chat = {
      UserDestination: user,
      UserOrigin: currentUser,
      UserDestinationId: user.Id,
      UserOriginId: currentUser.Id,
    };

    this._actualConversation.next(newConversation);
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
          case ChatRequestType.ALL_CHATS:
            console.log("Todos los chats guardados : ", message.Data.Data);
            this._allChats.next(message.Data.Data);

            break;
          case ChatRequestType.SEND_MESSAGE:
            try {
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

                this.sendGetAllChatsRequest();
              }
            } catch (e) {
              console.error(e);
            }
            break;

          case ChatRequestType.MODIFY_MESSAGE:
            try {
              const messageModified: ChatMessage = message.Data.Data;
              console.log("mensaje modificado : ", messageModified);

              const currentConversation = this._actualConversation.getValue();

              const messagePosition =
                currentConversation.ChatMessages.findIndex(
                  (m) => m.Id === messageModified.Id
                );

              if (messagePosition !== -1) {
                const updatedMessages = [...currentConversation.ChatMessages];
                updatedMessages[messagePosition] = messageModified;

                const updatedConversation = {
                  ...currentConversation,
                  ChatMessages: updatedMessages,
                };

                this._actualConversation.next(updatedConversation);

                this.sendGetAllChatsRequest();
              }
            } catch (e) {
              console.error(e);
            }
            break;
          case ChatRequestType.DELETE_MESSAGE:
            const messageId: number = message.Data.Data;

            const currentConversation = this._actualConversation.value;

            const updatedConversation = {
              ...currentConversation,
              ChatMessages: currentConversation.ChatMessages.filter(
                (message) => message.Id !== messageId
              ),
            };

            this._actualConversation.next(updatedConversation);

            this.sendGetAllChatsRequest();

            break;
          default:
            console.error("Tipo de solicitud no reconocido");
        }
        break;
    }
  }

  async sendGetAllChatsRequest(): Promise<void> {
    const request: ChatRequestBase = {
      ChatRequestType: ChatRequestType.ALL_CHATS,
    };

    const socketMessage = new SocketMessageGeneric<ChatRequestBase>();
    socketMessage.Type = SocketCommunicationType.CHAT;
    socketMessage.Data = request;

    websocketService.send(JSON.stringify(socketMessage));
  }

  async sendMessage(message: string): Promise<void> {
    const currentUser = userService.getCurrentUser();

    const request: ChatRequestGeneric<SendMessageRequest> = {
      ChatRequestType: ChatRequestType.SEND_MESSAGE,
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

  async markMessageAsViewed(messageId: number): Promise<void> {
    const request: ChatRequestGeneric<ModifyChatMessage> = {
      ChatRequestType: ChatRequestType.MODIFY_MESSAGE,
      Data: {
        Id: messageId,
        IsViewed: true,
      },
    };

    const socketMessage = new SocketMessageGeneric<
      ChatRequestGeneric<ModifyChatMessage>
    >();
    socketMessage.Type = SocketCommunicationType.CHAT;
    socketMessage.Data = request;

    console.log(`Marcando mensaje ${messageId} como leído...`, socketMessage);

    websocketService.send(JSON.stringify(socketMessage));
  }

  async sendEditMessageRequest(messageId: number, text: string): Promise<void> {
    const request: ChatRequestGeneric<ModifyChatMessage> = {
      ChatRequestType: ChatRequestType.MODIFY_MESSAGE,
      Data: {
        Id: messageId,
        Message: text,
      },
    };

    const socketMessage = new SocketMessageGeneric<
      ChatRequestGeneric<ModifyChatMessage>
    >();
    socketMessage.Type = SocketCommunicationType.CHAT;
    socketMessage.Data = request;

    console.log(`Editando el mensaje ${messageId}`, socketMessage);

    websocketService.send(JSON.stringify(socketMessage));
  }

  async sendDeleteMessageRequest(messageId: number): Promise<void> {
    const request: ChatRequestGeneric<number> = {
      ChatRequestType: ChatRequestType.DELETE_MESSAGE,
      Data: messageId,
    };

    const socketMessage = new SocketMessageGeneric<
      ChatRequestGeneric<number>
    >();
    socketMessage.Type = SocketCommunicationType.CHAT;
    socketMessage.Data = request;

    console.log(`Eliminando el mensaje ${messageId}`, socketMessage);

    websocketService.send(JSON.stringify(socketMessage));
  }
}

export default new ChatService();
