import { ClassType } from "./enums/class-type";
import { User } from "./user";

export interface ScheduleDto {
    Id: number;
    ClassId: number;
    ClassType: ClassType;
    Description: string;
    Trainer?: User;
    MaxCapacity: number;
    Price: number;
    StartDateTime: Date;
    EndDateTime: Date;
}