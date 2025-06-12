import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import apiService from "./api.service";
import { NewUserRequest } from "../models/new-user-request";

class UserService {
  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  USER_URL = "User";
  ALL_USER_URL = "User/all";
  CHANGE_USER_ROLE_URL = "User/changeRole";

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

  public cleanService() {
    this._currentUser.next(null);
  }

  public async editUseData(newData: NewUserRequest): Promise<void> {
    const formData = new FormData();
    formData.append("Name", newData.name);
    formData.append("Phone", newData.phone);
    formData.append("Email", newData.email);
    formData.append("Password", newData.password);

    if (newData.image) {
      formData.append("Image", newData.image);
    }

    const response = await apiService.put<User>(this.USER_URL, formData);

    if (!response.success) {
      throw new Error("Updated user failed");
    }

    console.log("User updated successful:", response);
    this._currentUser.next(response.data);
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

  roleMap: Record<string, number> = {
    user: 0,
    trainer: 1,
    admin: 2,
  };

  public async changeUserRole(userId: number, role: string): Promise<User> {
    const roleNumber = this.roleMap[role.toLowerCase()];

    const response = await apiService.put<User>(this.CHANGE_USER_ROLE_URL, {
      UserId: userId,
      Role: roleNumber,
    });

    if (!response.success) {
      throw new Error("Error al cambiar el rol del usuario");
    }

    return response.data;
  }
}

export default new UserService();
