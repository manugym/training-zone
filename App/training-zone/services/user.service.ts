import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import apiService from "./api.service";

class UserService {
  private readonly USER_URL = "/User";

  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  constructor() {
    this.loadCurrentUser();
  }

  public async loadCurrentUser(): Promise<void> {
    try {
      await apiService.initializeJwt();
      const user = await this.getAuthenticatedUser();
      this._currentUser.next(user);
    } catch (error) {
      console.error("No se pudo cargar el usuario:", error);
      this._currentUser.next(null);
    }
  }

  public async getAuthenticatedUser(): Promise<User> {
    console.log("Obteniendo usuario con token : ", apiService.jwt);

    const response = await apiService.get<User>(this.USER_URL);

    console.log("Usuario obtenido", response);

    if (!response.success) {
      throw new Error("Error con la autenticación del usuario");
    }

    console.log("Usuario autenticado", response);
    return response.data;
  }

  public getCurrentUser(): User {
    return this._currentUser.value;
  }
}

export default new UserService();
