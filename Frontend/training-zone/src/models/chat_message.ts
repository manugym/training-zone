export interface ChatMessage {
  Id: number;
  ChatId: number;
  UserId: number;
  Message: string;
  MessageDateTime: Date;
  Viewed: boolean;
}
