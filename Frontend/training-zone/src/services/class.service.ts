import { Class } from "../models/class";
import apiService from "./api.service";

class ClassService {
  private readonly ALL_CLASSES_URL = "Class/getAll"
  private readonly CLASS_URL = "Class"

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
}

export default new ClassService();