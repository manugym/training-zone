import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import apiService from "./api.service";
import { RoutinePreferences } from "@/models/routine-preferences";


class RoutineService {
  private readonly ROUTINE_GENERATOR_URL = "/RoutineGenerator"

  async getRoutine(preferences: RoutinePreferences): Promise<string> {
      const response = await apiService.post<ArrayBuffer>(this.ROUTINE_GENERATOR_URL, preferences, "application/json", true);
      console.log('RESPUESTA CRUDA:', response);
      if(!response.success || !response.data) {
        console.log("Error detectado. response.success:", response.success, "response.data:", response.data);
        throw new Error(response.error || "Error generando la rutina");
      }
      const b64 = Buffer.from(response.data).toString("base64");
      console.log(b64)
      const fileUri = FileSystem.documentDirectory + "RutinaGimnasio.pdf";
      await FileSystem.writeAsStringAsync(fileUri, b64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return fileUri;
    }
  }

  export default new RoutineService();
