export interface Schedule {
  Id: number;
  ClassId: number;
  UserId: number;
  MaxCapacity: number;
  Price: number;
  StartDateTime: Date;
  EndDateTime: Date;
}
