import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TextInput } from "react-native";
import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Button, useTheme, ActivityIndicator } from "react-native-paper";
import { RoutinePreferences } from "@/models/routine-preferences";
import RNPickerSelect from "react-native-picker-select";
import { UserLanguage } from "@/models/enums/user-language";
import { UserGender } from "@/models/enums/user-gender";
import { UserGoal } from "@/models/enums/user-goal";
import { UserLevel } from "@/models/enums/user-level";
import { UserPreferredActivities } from "@/models/enums/user-preferred-activities";
import * as Localization from "expo-localization";

const enumToPickerItems = (e: any) => [
  { label: "Selecciona una opción...", value: -1 },
  ...Object.entries(e)
    .filter(([k, v]) => !isNaN(Number(v)))
    .map(([label, value]) => ({ label, value: Number(value) })),
];

export default function RoutinePreferencesScreen() {
  const theme = useTheme();

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

  const [preferences, setPreferences] = useState<RoutinePreferences>({
    language: -1,
    age: 0,
    gender: -1,
    heightCm: 0,
    weightKg: 0,
    goal: -1,
    level: -1,
    daysPerWeek: 0,
    timeToTrainMinutes: 0,
    preferredActivities: -1,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await AsyncStorage.getItem("routine_preferences");
        let initialPrefs: RoutinePreferences = {
          language: -1,
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

        if (saved) {
          initialPrefs = JSON.parse(saved);
        }

        //detects the system language
        const langCode = Localization.getLocales()[0].languageCode;
        initialPrefs.language =
          langCode === "es" ? UserLanguage.Spanish : UserLanguage.English;

        setPreferences(initialPrefs);
      } catch (error) {
        console.error("Error al cargar preferencias guardadas", error);
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

  const handleSave = async () => {
    if (!isValid()) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    setSaving(true);
    try {
      await AsyncStorage.setItem(
        "routine_preferences",
        JSON.stringify(preferences)
      );
      alert("Preferencias guardadas correctamente.");
      router.back();
    } catch (error) {
      alert("Hubo un error al guardar las preferencias.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.viewContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Stack.Screen options={{ title: "Tus preferencias" }} />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Preferencias para la rutina
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
          onPress={handleSave}
          style={styles.button}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{ fontSize: 18 }}
          disabled={saving}
        >
          Guardar preferencias
        </Button>

        {saving && (
          <ActivityIndicator animating size="large" style={{ marginTop: 20 }} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingVertical: 20,
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
    marginTop: 30,
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
