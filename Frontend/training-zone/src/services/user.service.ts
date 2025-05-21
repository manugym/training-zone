import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import apiService from "./api.service";

class UserService {
  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  USER_URL = "User";
  ALL_USER_URL = "User/all";

  constructor() {}

  public async loadCurrentUser(): Promise<void> {
    try {
      console.log("Cargando usuario, JWT :", apiService.jwt);

      if (this._currentUser.value !== null) {
        return;
      }

      const user = await this.getAuthenticatedUser();
      this._currentUser.next(user);
    } catch (error) {
      console.error("No se pudo cargar el usuario:", error);
      this._currentUser.next(null);
    }
  }

  public async getAuthenticatedUser(): Promise<User> {
    if (!apiService.jwt) {
      return null;
    }

    const response = await apiService.get<User>(this.USER_URL);

    if (!response.success) {
      throw new Error("Error con la autenticación del usuario");
    }

    console.log("Usuario autenticado", response);
    return response.data;
  }

  public getCurrentUser(): User {
    return this._currentUser.value;
  }

  public async getAllUsers(): Promise<User[]> {
    const response = await apiService.get<User[]>(this.ALL_USER_URL);

    if (!response.success) {
      throw new Error("Error al obtener todos los usuarios");
    }

    const currentUser = this._currentUser.value;

    if (!currentUser) {
      return response.data;
    }

    const filteredUsers = response.data.filter(
      (user) => user.Id !== currentUser.Id
    );

    console.log("Usuarios excluyendo al autenticado", filteredUsers);

    return filteredUsers;
  }
}

export default new UserService();
