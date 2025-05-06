export interface ChatMessage {
  id: number;
  chatId: number;
  message: string;
  messageDateTime: Date;
  viewed: boolean;
}
