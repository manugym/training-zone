import { SocketCommunicationType } from "../enums/socket-communication-type";

export class SocketMessage {
  Type!: SocketCommunicationType;
}

export class SocketMessageGeneric<T> extends SocketMessage {
  Data!: T;
}
