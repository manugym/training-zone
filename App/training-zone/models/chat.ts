import { ChatMessage } from "./chat-message";
import { User } from "./user";

export interface Chat {
  Id?: number;
  UserOriginId?: number;
  UserDestinationId?: number;
  ChatMessages?: ChatMessage[];
  UserOrigin?: User;
  UserDestination?: User;
}
