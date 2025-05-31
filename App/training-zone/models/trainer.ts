import { Schedule } from "./schedule";
import { User } from "./user";

export interface Trainer {
  User: User;
  TrainerClasses: Schedule[];
}
