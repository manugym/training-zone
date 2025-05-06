export interface Chat {
  id: number;
  userOriginId: number;
  userDestinationId: number;
  chatMessages: Chat[];
}
