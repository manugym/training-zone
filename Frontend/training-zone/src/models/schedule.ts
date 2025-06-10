import { ClassType } from "./enums/class-type.ts";
import { Trainer } from "./trainer.ts";

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
