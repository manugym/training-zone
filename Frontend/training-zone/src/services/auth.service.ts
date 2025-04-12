import { AuthRequest } from "../models/auth-request";
import { AuthResponse } from "../models/auth-response";
import { NewUserRequest } from "../models/new-user-request";
import ApiService from "./api.service";

const AuthService = {
  login: async (request: AuthRequest): Promise<AuthResponse> => {
    const response = await ApiService.post<AuthResponse>("Auth/login", {
      credential: request.credential,
      password: request.password,
    });

    if (!response.success || !response.data?.accessToken) {
      throw new Error("Login failed: Token not received");
    }

    console.log("Login response:", response);
    localStorage.setItem("token", response.data.accessToken);
    return response.data;
  },
  register: async (request: NewUserRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append("Name", request.name);
    formData.append("Phone", request.phone);
    formData.append("Email", request.email);
    formData.append("Password", request.password);

    if (request.image) {
      formData.append("ImagePath", request.image);
    }

    const response = await ApiService.post<AuthResponse>(
      "Auth/register",
      formData
    );

    if (!response.success || !response.data?.accessToken) {
      throw new Error("Login failed: Token not received");
    }

    console.log("Login response:", response);
    localStorage.setItem("token", response.data.accessToken);
    return response.data;
  },
};

export default AuthService;
