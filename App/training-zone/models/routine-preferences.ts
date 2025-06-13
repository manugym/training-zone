import { UserGender } from "./enums/user-gender";
import { UserGoal } from "./enums/user-goal";
import { UserLanguage } from "./enums/user-language";
import { UserLevel } from "./enums/user-level";
import { UserPreferredActivities } from "./enums/user-preferred-activities";

export type ThemePreference = "light" | "dark" | "system";

export interface RoutinePreferences {
  language: UserLanguage | -1;
  age: number;
  gender: UserGender | -1;
  heightCm: number;
  weightKg: number;
  goal: UserGoal | -1;
  level: UserLevel | -1;
  daysPerWeek: number;
  timeToTrainMinutes: number;
  preferredActivities: UserPreferredActivities | -1;
}
