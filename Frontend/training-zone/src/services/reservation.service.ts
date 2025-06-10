import { Reservation } from "../models/reservation";
import apiService from "./api.service";

class ReservationService {
  private readonly RESERVATION_URL = "Reservation"


  async getReservationsByUser(): Promise<Reservation[]> {
    const response = await apiService.get<Reservation[]>(`${this.RESERVATION_URL}/reservationsByUser`);

    if(!response.success) {
      throw new Error("Failed to fetch reservations: " + response.error);
    }

    return response.data;
  }

  async deleteReservation(id: number): Promise<Reservation> {
    const response = await apiService.delete<Reservation>(`${this.RESERVATION_URL}?reservationId=${id}`);

    if(!response.success){
      throw new Error("Failed to delete reservation: " + response.error);
    }

    return response.data;
  }

  async createReservation(id: number): Promise<Reservation> {
    const response = await apiService.post<Reservation>(`${this.RESERVATION_URL}?scheduleId=${id}`)
  
    if(!response.success){
      throw new Error("Failed to create reservation: " + response.error); 
    }

    return response.data;
  }
}

export default new ReservationService();