import { ChatMessage } from "./chat_message";

export interface Chat {
  Id: number;
  UserOriginId: number;
  UserDestinationId: number;
  ChatMessages: ChatMessage[];
}
