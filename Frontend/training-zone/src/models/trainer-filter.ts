import { ClassType } from "./enums/class-type";

export interface TrainerFilter {
  classType?: ClassType;
  name?: string;
  entitiesPerPage: number;
  actualPage: number;
}
