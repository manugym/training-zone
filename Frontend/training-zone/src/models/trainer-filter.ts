import { ClassType } from "./enums/ClassType";

export interface TrainerFilter {
  classType?: ClassType;
  name?: string;
  entitiesPerPage: number;
  actualPage: number;
}
