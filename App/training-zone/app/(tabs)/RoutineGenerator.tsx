import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TextInput, Alert } from "react-native";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";
import { Text, Button, useTheme, ActivityIndicator } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import { RoutinePreferences } from "@/models/routine-preferences";
import { UserLanguage } from "@/models/enums/user-language";
import { UserGender } from "@/models/enums/user-gender";
import { UserGoal } from "@/models/enums/user-goal";
import { UserLevel } from "@/models/enums/user-level";
import { UserPreferredActivities } from "@/models/enums/user-preferred-activities";
import * as Localization from "expo-localization";
import routineService from "@/services/routine.service";

const enumToPickerItems = (e: any) => [
  ...Object.entries(e)
    .filter(([k, v]) => !isNaN(Number(v)))
    .map(([label, value]) => ({ label, value: Number(value) })),
];

const defaultPreferences = (): RoutinePreferences => {
  const langCode = Localization.getLocales()[0].languageCode;
  return {
    language: langCode === "es" ? UserLanguage.Spanish : UserLanguage.English,
    age: 0,
    gender: -1,
    heightCm: 0,
    weightKg: 0,
    goal: -1,
    level: -1,
    daysPerWeek: 0,
    timeToTrainMinutes: 0,
    preferredActivities: -1,
  };
};

export default function RoutineGenerator() {
  const theme = useTheme();

  const [preferences, setPreferences] = useState<RoutinePreferences>(
    defaultPreferences()
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  //Load user preferences to local storage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await AsyncStorage.getItem("routine_preferences");
        if (saved) {
          const parsed = JSON.parse(saved);
          setPreferences(parsed);
        }
      } catch (e) {
        console.error("Error al cargar preferencias", e);
      } finally {
        setLoading(false);
      }
    };
    loadPreferences();
  }, []);

  const handleChange = <K extends keyof RoutinePreferences>(
    key: K,
    value: RoutinePreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = () => {
    return (
      preferences.gender !== -1 &&
      preferences.goal !== -1 &&
      preferences.level !== -1 &&
      preferences.preferredActivities !== -1 &&
      preferences.age > 0 &&
      preferences.heightCm > 0 &&
      preferences.weightKg > 0 &&
      preferences.daysPerWeek > 0 &&
      preferences.timeToTrainMinutes > 0
    );
  };

  const handleSaveAndGenerate = async () => {
    if (!isValid()) {
      Alert.alert(
        "Campos incompletos",
        "Por favor completa todos los campos correctamente."
      );
      return;
    }

    setProcessing(true);
    try {
      await AsyncStorage.setItem(
        "routine_preferences",
        JSON.stringify(preferences)
      );
      const fileUri = await routineService.getRoutine(preferences);
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert(
          "Archivo listo",
          "No se puede compartir desde este dispositivo."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo generar la rutina");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setPreferences(defaultPreferences());
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const pickerInputStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outline,
    color: theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  };

  return (
    <View
      style={[
        styles.viewContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Stack.Screen options={{ title: "Preferencias y Rutina" }} />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Genera una rutina personalizada
        </Text>

        <View style={styles.field}>
          <Text>Género</Text>
          <RNPickerSelect
            onValueChange={(value) => handleChange("gender", value)}
            value={preferences.gender}
            items={enumToPickerItems(UserGender)}
            style={{
              inputIOS: pickerInputStyle,
              inputAndroid: pickerInputStyle,
              placeholder: { color: theme.colors.onSurfaceDisabled },
            }}
          />
        </View>

        <View style={styles.field}>
          <Text>Objetivo</Text>
          <RNPickerSelect
            onValueChange={(value) => handleChange("goal", value)}
            value={preferences.goal}
            items={enumToPickerItems(UserGoal)}
            style={{
              inputIOS: pickerInputStyle,
              inputAndroid: pickerInputStyle,
              placeholder: { color: theme.colors.onSurfaceDisabled },
            }}
          />
        </View>

        <View style={styles.field}>
          <Text>Nivel</Text>
          <RNPickerSelect
            onValueChange={(value) => handleChange("level", value)}
            value={preferences.level}
            items={enumToPickerItems(UserLevel)}
            style={{
              inputIOS: pickerInputStyle,
              inputAndroid: pickerInputStyle,
              placeholder: { color: theme.colors.onSurfaceDisabled },
            }}
          />
        </View>

        <View style={styles.field}>
          <Text>Actividad preferida</Text>
          <RNPickerSelect
            onValueChange={(value) =>
              handleChange("preferredActivities", value)
            }
            value={preferences.preferredActivities}
            items={enumToPickerItems(UserPreferredActivities)}
            style={{
              inputIOS: pickerInputStyle,
              inputAndroid: pickerInputStyle,
              placeholder: { color: theme.colors.onSurfaceDisabled },
            }}
          />
        </View>

        {(
          [
            ["age", "Edad"],
            ["heightCm", "Altura (cm)"],
            ["weightKg", "Peso (kg)"],
            ["daysPerWeek", "Días por semana"],
            ["timeToTrainMinutes", "Minutos por sesión"],
          ] as [keyof RoutinePreferences, string][]
        ).map(([key, label]) => (
          <View key={key} style={styles.field}>
            <Text>{label}</Text>
            <TextInput
              keyboardType="numeric"
              value={preferences[key] === 0 ? "" : preferences[key].toString()}
              onChangeText={(text) => handleChange(key, parseInt(text) || 0)}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outline,
                  color: theme.colors.onBackground,
                },
              ]}
            />
          </View>
        ))}

        <Button
          mode="contained"
          onPress={handleSaveAndGenerate}
          style={styles.button}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{ fontSize: 18 }}
          disabled={processing}
        >
          Guardar y generar rutina
        </Button>

        <Button
          mode="outlined"
          onPress={handleReset}
          style={styles.button}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{ fontSize: 18 }}
          disabled={processing}
        >
          Restablecer valores
        </Button>

        {processing && (
          <ActivityIndicator animating size="large" style={{ marginTop: 20 }} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingVertical: 100,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  field: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
    alignSelf: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
