import { UserGoal } from "./enums/user-goal";
import { UserLanguage } from "./enums/user-language";
import { UserLevel } from "./enums/user-level";
import { UserPreferredActivities } from "./enums/user-preferred-activities";

export interface RoutinePreferences {
  language: UserLanguage;
  age: number;
  gender: number;
  heightCm: number;
  weightKg: number;
  goal: UserGoal;
  level: UserLevel;
  daysPerWeek: number;
  timeToTrainMinutes: number;
  preferredActivities: UserPreferredActivities;
}