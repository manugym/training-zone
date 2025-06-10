import apiService from "./api.service";
import { CreateSchedule } from "../models/create-schedule";
import { UpdateSchedule } from "../models/update-schedule";
import { ScheduleDto } from "../models/schedule-dto";
import { TrainerDto } from "../models/trainer-dto";

class ScheduleService {
  private readonly SCHEDULE_URL = "Schedule"

  async createSchedule(newSchedule: CreateSchedule): Promise<ScheduleDto> {
    const response = await apiService.post<ScheduleDto>(this.SCHEDULE_URL, newSchedule);

    if(!response.success) {
      throw new Error("Failed to create new schedule: " + response.error); 
    }

    return response.data;
  }

  async deleteSchedule(id: number): Promise<ScheduleDto> {
    const response = await apiService.delete<ScheduleDto>(`${this.SCHEDULE_URL}/${id}`);
  
    if(!response.success){
      throw new Error("Failed to delete schedule: " + response.error);
    }

    return response.data;
  }

  async updateSchedule(id: number, updateSchedule: UpdateSchedule): Promise<ScheduleDto> {
    const response = await apiService.put<ScheduleDto>(`${this.SCHEDULE_URL}/${id}`, updateSchedule);
  
    if(!response.success){
      throw new Error("Failed to update schedule: " + response.error);
    }

    return response.data;
  }

  async getAllSchedules(): Promise<ScheduleDto[]> {
    const response = await apiService.get<ScheduleDto[]>(`${this.SCHEDULE_URL}/schedules`)
  
    if(!response.success){
      throw new Error("Failed to fetch all schedules: " + response.error);
    }

    return response.data;
  }

  async getAllTrainers(): Promise<TrainerDto[]> {
    const response = await apiService.get<TrainerDto[]>(`${this.SCHEDULE_URL}/trainers`)
  
    if(!response.success){
      throw new Error("Failed to fetch all trainers: " + response.error);
    }

    return response.data;
  }

}

export default new ScheduleService();