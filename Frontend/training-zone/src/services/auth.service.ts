import { AuthRequest } from "../models/auth-request";
import { AuthResponse } from "../models/auth-response";
import { NewUserRequest } from "../models/new-user-request";
import ApiService from "./api.service";

const AuthService = {
  login: async (request: AuthRequest): Promise<AuthResponse> => {
    const response = await ApiService.post<AuthResponse>("auth/login", {
      credential: request.credential,
      password: request.password,
    });

    if (!response.success || !response.data?.token) {
      throw new Error("Login failed: Token not received");
    }

    console.log("Login response:", response);
    localStorage.setItem("token", response.data.token);
    return response.data;
  },
  register: async (request: NewUserRequest): Promise<AuthResponse> => {
    const response = await ApiService.post<AuthResponse>("auth/login", {
      name: request.name,
      phone: request.phone,
      email: request.email,
      password: request.password,
      imagePath: request.imagePath,
    });

    if (!response.success || !response.data?.token) {
      throw new Error("Login failed: Token not received");
    }

    console.log("Login response:", response);
    localStorage.setItem("token", response.data.token);
    return response.data;
  },
};

export default AuthService;
