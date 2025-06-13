import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { ThemedView } from "../ThemedView";
import authService from "@/services/auth.service";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Shapes } from "@/constants/Shapes";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation("auth");

  const theme = useTheme();
  const router = useRouter();

  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (!credentials) return t("error.emailOrPhoneRequired");

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials);
    const isPhone = /^[0-9]{9}$/.test(credentials);

    if (!isEmail && !isPhone) {
      return t("error.invalidEmailOrPhone");
    }

    if (!password) return t("error.passwordRequired");

    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      Toast.show({
        type: "error",
        text1: t("error.title"),
        text2: validationError,
        position: "bottom",
      });
      return;
    }

    try {
      await authService.login({
        credential: credentials,
        password: password,
      });

      Alert.alert(t("success.loginTitle"), t("success.welcomeBack"));
      router.push("/");
    } catch (err) {
      const message = err.message || t("error.generic");

      Toast.show({
        type: "error",
        text1: t("error.title"),
        text2: message,
        position: "bottom",
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        label={t("form.emailOrPhone")}
        value={credentials}
        onChangeText={(text) => setCredentials(text.trim())}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        theme={{
          colors: {
            primary: theme.colors.surface,
          },
        }}
      />

      <TextInput
        label={t("form.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        theme={{
          colors: {
            primary: theme.colors.surface,
          },
        }}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={{ borderRadius: Shapes.medium }}
        labelStyle={{ fontSize: 18, paddingVertical: 6 }}
      >
        {t("form.loginButton")}
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    justifyContent: "center",
    gap: 20,
  },
});
