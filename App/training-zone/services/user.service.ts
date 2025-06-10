import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import apiService from "./api.service";
import { NewUserRequest } from "@/models/new-user-request";

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

  public async editUseData(newData: NewUserRequest): Promise<void> {
    const formData = new FormData();
    formData.append("Name", newData.name);
    formData.append("Phone", newData.phone);
    formData.append("Email", newData.email);
    formData.append("Password", newData.password);

    if (newData.image) {
      const fileName = newData.image.split("/").pop() || "image.jpg";

      formData.append("Image", {
        uri: newData.image,
        name: fileName,
        type: "image/jpeg",
      } as any);
    }

    const response = await apiService.put<User>(this.USER_URL, formData);

    if (!response.success) {
      throw new Error("Updated user failed");
    }

    console.log("User updated successful:", response);
    this._currentUser.next(response.data);
  }
}

export default new UserService();
