export interface UpdateSchedule {
  ClassId?: number;
  UserId: number;
  MaxCapacity?: number;
  Price?: number;
  StartDateTime?: Date;
  EndDateTime?: Date;
}