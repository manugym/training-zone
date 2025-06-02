import { AllTrainers } from "@/models/all-trainers";
import { TrainerFilter } from "@/models/trainer-filter";
import apiService from "./api.service";
import { Trainer } from "@/models/trainer";

class TrainerService {
  private readonly ALL_TRAINER_URL = "/Trainer/allTrainers";
  private readonly TRAINER_URL = "/Trainer";

  async getAllTrainers(filter: TrainerFilter): Promise<AllTrainers> {
    const response = await apiService.post<AllTrainers>(
      this.ALL_TRAINER_URL,
      filter
    );

    if (!response.success) {
      throw new Error("Failed to fetch trainers: " + response.error);
    }

    console.log("All trainers : ", response.data);
    return response.data;
  }

  async getTrainerById(id: number): Promise<Trainer> {
    const response = await apiService.get<Trainer>(`${this.TRAINER_URL}/${id}`);

    if (!response.success) {
      throw new Error("Failed to fetch trainer: " + response.error);
    }

    return response.data;
  }
}

export default new TrainerService();
