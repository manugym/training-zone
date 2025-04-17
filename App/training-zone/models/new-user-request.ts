import { ImagePickerAsset } from "expo-image-picker";

export interface NewUserRequest {
  name: string;
  phone: string;
  email: string;
  password: string;
  image?: string;
}
