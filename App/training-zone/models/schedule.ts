import { ClassType } from "./enums/class-type";
import { Trainer } from "./trainer";

export interface Schedule {
  Id: number;
  ClassId: number;
  ClassType: ClassType;
  Description: string;
  Trainer?: Trainer;
  MaxCapacity: number;
  Price: number;
  StartDateTime: Date;
  EndDateTime: Date;
}
