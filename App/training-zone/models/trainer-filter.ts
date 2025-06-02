import { ClassType } from "./enums/class-type";

export interface TrainerFilter {
  ClassType?: ClassType;
  Name?: string;
  entitiesPerPage?: number;
  actualPage?: number;
}
