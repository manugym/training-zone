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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("routine");

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
      Alert.alert(t("incompleteTitle"), t("incompleteMessage"));
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
        Alert.alert(t("fileReadyTitle"), t("fileReadyMessage"));
      }
    } catch (error: any) {
      Alert.alert(t("errorTitle"), error.message || t("errorGeneric"));
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
      <Stack.Screen options={{ title: t("headerTitle") }} />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          {t("title")}
        </Text>

        <View style={styles.field}>
          <Text>{t("gender")}</Text>
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
          <Text>{t("goal")}</Text>
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
          <Text>{t("level")}</Text>
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
          <Text>{t("preferredActivities")}</Text>
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
            ["age", "age"],
            ["heightCm", "height"],
            ["weightKg", "weight"],
            ["daysPerWeek", "daysPerWeek"],
            ["timeToTrainMinutes", "minutesPerSession"]
          ] as [keyof RoutinePreferences, string][]
        ).map(([key, label]) => (
          <View key={key} style={styles.field}>
            <Text>{t(label)}</Text>
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
          {t("generate")}
        </Button>

        <Button
          mode="outlined"
          onPress={handleReset}
          style={styles.button}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{ fontSize: 18 }}
          disabled={processing}
        >
          {t("reset")}
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
