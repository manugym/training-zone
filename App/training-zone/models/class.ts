import { ClassType } from "./enums/class-type";
import { Schedule } from "./schedule";

export interface Class {
  Id: number;
  Type: ClassType;
  Description: string;
  ClassImageUrl: string;
  Schedules: Schedule[];
}
