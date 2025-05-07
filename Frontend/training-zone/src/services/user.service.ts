import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import apiService from "./api.service";

class UserService {
  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  constructor() {
    this.loadCurrentUser();
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      const user = await this.getAuthenticatedUser();
      this._currentUser.next(user);
    } catch (error) {
      console.error("No se pudo cargar el usuario:", error);
      this._currentUser.next(null);
    }
  }

  public async getAuthenticatedUser(): Promise<User> {
    const response = await apiService.get<User>("User");

    if (!response.success) {
      throw new Error("Error con la autenticación del usuario");
    }

    console.log("Usuario autenticado", response);
    return response.data;
  }
}

export default new UserService();
