import { Class } from "@/models/class"
import { Schedule } from "@/models/schedule";
import apiService from "./api.service";

class ClassService {
  private readonly ALL_CLASSES_URL = "/Class/getAll"
  private readonly CLASS_URL = "/Class"
  private readonly SCHEDULE_BY_DATE = "/Schedule/byDate"

  async getAllClasses(): Promise<Class[]> {
    const response = await apiService.get<Class[]>(this.ALL_CLASSES_URL);
  
    if(!response.success){
      throw new Error("Failed to fetch classes: " + response.error);
    }

    return response.data;
  }

  async getClassById(id: number): Promise<Class> {
    const response = await apiService.get<Class>(`${this.CLASS_URL}/${id}`);

    if (!response.success) {
      throw new Error("Failed to fetch class: " + response.error);
    }

    return response.data;
  }

  async getClassesByDate(classId: string, date: string): Promise<Schedule[]> {
    const response = await apiService.get<Schedule[]>(`${this.SCHEDULE_BY_DATE}?classId=${classId}&date=${date}`);

    if (!response.success) {
      throw new Error("Failed to fetch schedules: " + response.error);
    }

    const schedules = response.data.map((s) => ({
      ...s,
      StartDateTime: new Date(s.StartDateTime),
      EndDateTime: new Date(s.EndDateTime)
    }))
    return schedules;
  }
}

export default new ClassService();
