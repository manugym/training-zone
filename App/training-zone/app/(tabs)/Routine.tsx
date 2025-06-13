import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { Stack, router } from "expo-router";
import { Button, Text, useTheme, ActivityIndicator } from "react-native-paper";
import type { RoutinePreferences } from "@/models/routine-preferences";
import routineService from "@/services/routine.service";

export default function GenerateRoutineScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [preferences, setPreferences] = useState<RoutinePreferences | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await AsyncStorage.getItem("routine_preferences");
        if (saved) {
          const parsed: RoutinePreferences = JSON.parse(saved);
          setPreferences(parsed);
        }
      } catch (e) {
        console.error("Error al cargar las preferencias", e);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const isPreferencesValid = (prefs: RoutinePreferences | null) => {
    if (!prefs) return false;
    return (
      prefs.language !== -1 &&
      prefs.gender !== -1 &&
      prefs.goal !== -1 &&
      prefs.level !== -1 &&
      prefs.preferredActivities !== -1 &&
      prefs.age > 0 &&
      prefs.heightCm > 0 &&
      prefs.weightKg > 0 &&
      prefs.daysPerWeek > 0 &&
      prefs.timeToTrainMinutes > 0
    );
  };

  const handleGenerate = async () => {
    if (!preferences) return;
    setGenerating(true);

    try {
      const fileUri = await routineService.getRoutine(preferences);
      Alert.alert("¡Descargado!", "La rutina se ha guardado correctamente en el dispositivo.");

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Archivo listo", "No se puede compartir desde este dispositivo.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo generar la rutina");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={[styles.viewContainer, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: "Generar rutina" }} />

      {loading ? (
        <ActivityIndicator animating size="large" color={theme.colors.primary} />
      ) : !isPreferencesValid(preferences) ? (
        <>
          <Text
            style={{
              textAlign: "center",
              marginBottom: 20,
              fontWeight: "bold",
              fontSize: 18,
              textTransform: "none",
              color: theme.colors.onBackground,
            }}
          >
            Faltan preferencias. <br /><br />Por favor ve a la pestaña de preferencias para continuar.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push("/Preferences")}
            style={styles.button}
            contentStyle={{ paddingVertical: 10 }}
            labelStyle={{ fontSize: 18 }}
          >
            Ir a preferencias
          </Button>
        </>
      ) : generating ? (
        <ActivityIndicator animating size="large" color={theme.colors.primary} />
      ) : (
        <Button
          mode="contained"
          onPress={handleGenerate}
          style={styles.button}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{ fontSize: 18 }}
        >
          Descargar rutina PDF
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  button: {
    alignSelf: "center",
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
  },
});
