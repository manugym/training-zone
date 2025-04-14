import { StyleSheet, Image, Platform } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import Login from "@/components/AuthForms/Login";
import Register from "@/components/AuthForms/Register";
import authService from "@/services/auth.service";
import apiService from "@/services/api.service";

export default function AuthScreen() {
  const [formType, setFormType] = useState<"login" | "register">("login");

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Login
      </ThemedText>
      <ThemedText type="subtitle" style={styles.title}>
        Register
      </ThemedText>

      <ThemedText type="subtitle" style={styles.title}>
        {apiService.jwt}
      </ThemedText>

      {formType === "login" ? <Login></Login> : <Register></Register>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
});
