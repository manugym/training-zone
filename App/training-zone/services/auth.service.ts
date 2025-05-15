import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthRequest } from "../models/auth-request";
import { AuthResponse } from "../models/auth-response";
import { NewUserRequest } from "../models/new-user-request";
import ApiService from "./api.service";
import userService from "./user.service";

class AuthService {
  private readonly TOKEN_KEY = "token";
  private readonly LOGIN_URL = "Auth/login";
  private readonly REGISTER_URL = "Auth/register";

  constructor() {}

  async login(request: AuthRequest): Promise<void> {
    const response = await ApiService.post<AuthResponse>(this.LOGIN_URL, {
      credential: request.credential,
      password: request.password,
    });

    if (!response.success || !response.data?.accessToken) {
      throw new Error("Login failed: Token not received");
    }

    console.log("Login successful:", response);

    this.setSession(response.data.accessToken);
  }

  async logout(): Promise<void> {
    console.log("Logging out...");

    try {
      await AsyncStorage.removeItem(this.TOKEN_KEY);
      ApiService.jwt = null;
      console.log("Logged out successfully", ApiService.jwt);
    } catch (error) {
      console.error("Error while logging out:", error);
    }
  }

  async register(request: NewUserRequest): Promise<void> {
    console.log("Registering user:", request);

    const formData = new FormData();
    formData.append("Name", request.name);
    formData.append("Phone", request.phone);
    formData.append("Email", request.email);
    formData.append("Password", request.password);

    if (request.image) {
      const fileName = request.image.split("/").pop() || "image.jpg";

      formData.append("ImagePath", {
        uri: request.image,
        name: fileName,
        type: "image/jpeg",
      } as any);
    }

    console.log("FormData for registration:", formData);

    const response = await ApiService.post<AuthResponse>(
      this.REGISTER_URL,
      formData
    );

    console.log("Response from registration:", response);

    if (!response.success || !response.data?.accessToken) {
      throw new Error("Registration failed: Token not received");
    }

    console.log("Registration successful:", response);
    this.setSession(response.data.accessToken);
  }

  private async setSession(token: string): Promise<void> {
    console.log("Setting session with token:", token);

    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, token);
      ApiService.jwt = token;

      await userService.loadCurrentUser();
    } catch (error) {
      console.error("Error while setting session:", error);
    }
  }
}

export default new AuthService();
