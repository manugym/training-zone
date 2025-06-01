import { Class } from "./class";
import { User } from "./user";

export interface Trainer {
  User: User;
  TrainerClasses: Class[];
}
