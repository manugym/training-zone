import { ChatRequestType } from "../enums/chat-request-type";

export class ChatRequestBase {
  ChatRequestType!: ChatRequestType;
}

export class ChatRequestGeneric<T> extends ChatRequestBase {
  Data!: T;
}
