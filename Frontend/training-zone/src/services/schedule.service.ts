import apiService from "./api.service";
import { CreateSchedule } from "../models/create-schedule";
import { UpdateSchedule } from "../models/update-schedule";
import { Schedule } from "../models/schedule";

class ScheduleService {
  private readonly SCHEDULE_URL = "Schedule"

  async createSchedule(newSchedule: CreateSchedule): Promise<Schedule> {
    const response = await apiService.post<Schedule>(this.SCHEDULE_URL, newSchedule);

    if(!response.success) {
      throw new Error("Failed to create new schedule: " + response.error); 
    }

    return response.data;
  }

  async deleteSchedule(id: number): Promise<Schedule> {
    const response = await apiService.delete<Schedule>(`${this.SCHEDULE_URL}/${id}`);
  
    if(!response.success){
      throw new Error("Failed to delete schedule: " + response.error);
    }

    return response.data;
  }

  async updateSchedule(id: number, updateSchedule: UpdateSchedule): Promise<Schedule> {
    const response = await apiService.put<Schedule>(`${this.SCHEDULE_URL}/${id}`, updateSchedule);
  
    if(!response.success){
      throw new Error("Failed to update schedule: " + response.error);
    }

    return response.data;
  }

  async getAllSchedules(): Promise<Schedule[]> {
    const response = await apiService.get<Schedule[]>(`${this.SCHEDULE_URL}/schedules`)
  
    if(!response.success){
      throw new Error("Failed to fetch all schedules: " + response.error);
    }

    return response.data;
  }

}

export default new ScheduleService();