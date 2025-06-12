import { AuthRequest } from "../models/auth-request";
import { AuthResponse } from "../models/auth-response";
import { NewUserRequest } from "../models/new-user-request";
import ApiService from "./api.service";
import userService from "./user.service";

class AuthService {
  private readonly TOKEN_KEY = "token";
  private readonly LOGIN_URL = "Auth/login";
  private readonly REGISTER_URL = "Auth/register";

  constructor() { }

  async login(request: AuthRequest, remember: boolean): Promise<void> {
    const response = await ApiService.post<AuthResponse>(this.LOGIN_URL, {
      credential: request.credential,
      password: request.password,
    });

    if (!response.success || !response.data?.accessToken) {
      throw new Error("Login failed: Token not received");
    }

    console.log("Login successful:", response);

    this.setSession(response.data.accessToken, remember);
    const user = await userService.getAuthenticatedUser();
    if(user){
      userService.setCurrentUser(user);
    }
  }

  async register(request: NewUserRequest, remember: boolean): Promise<void> {
    const formData = new FormData();
    formData.append("Name", request.name);
    formData.append("Phone", request.phone);
    formData.append("Email", request.email);
    formData.append("Password", request.password);

    if (request.image) {
      formData.append("ImagePath", request.image);
    }

    const response = await ApiService.post<AuthResponse>(
      this.REGISTER_URL,
      formData
    );

    if (!response.success || !response.data?.accessToken) {
      throw new Error("Registration failed: Token not received");
    }

    console.log("Registration successful:", response);
    this.setSession(response.data.accessToken, remember);
    const user = await userService.getAuthenticatedUser();
    if(user){
      userService.getCurrentUser();
    }
  }

  async logout(): Promise<void> {
    console.log("Logging out");
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    ApiService.jwt = null;
    userService.clearUser();
  }

  private async setSession(token: string, remember: boolean): Promise<void> {
    console.log("Setting session with token:", token, remember);
    if (remember) {
      sessionStorage.removeItem(this.TOKEN_KEY);
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      localStorage.removeItem(this.TOKEN_KEY);
    }

    ApiService.jwt = token;
  }
}

export default new AuthService();
