import { ChatRequestType } from "../enums/chat-request-type";

export interface ChatRequestBase {
  ChatRequestType: ChatRequestType;
}

export interface GetChatRequest extends ChatRequestBase {
  ChatRequestType: ChatRequestType.GET_CHAT;
  UserId: number;
}

export interface SendChatMessageRequest extends ChatRequestBase {
  ChatRequestType: ChatRequestType.SEND;
  DestinationUserId: number;
  Message: string;
}

export interface ModifyChatMessageRequest extends ChatRequestBase {
  ChatRequestType: ChatRequestType.MODIFY;
  MessageId: number;
  NewMessage: string;
}

export interface DeleteChatMessageRequest extends ChatRequestBase {
  ChatRequestType: ChatRequestType.DELETE;
  MessageId: number;
}
