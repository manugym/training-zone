import React, { useEffect, useState } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
  Alert,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import Checkbox from "expo-checkbox";
import { Colors } from "@/constants/Colors";
import authService from "@/services/auth.service";
import { useNavigation, useRouter } from "expo-router";

function Login() {
  const router = useRouter();

  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const [error, setError] = useState("");

  const validateForm = () => {
    if (!credentials) return "Email o teléfono requerido.";

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials);
    const isPhone = /^[0-9]{9}$/.test(credentials);

    if (!isEmail && !isPhone) {
      return "Ingresa un email o número de teléfono válido.";
    }

    if (!password) return "Contraseña requerida.";

    return "";
  };

  const handleSubmit = async () => {
    setError(validateForm());
    if (error) return;

    try {
      await authService.login(
        {
          credential: credentials,
          password: password,
        },
        rememberMe
      );

      Alert.alert("Inicio de sesión exitoso", "Bienvenido de nuevo!");
      router.push("/");
    } catch (err) {
      setError(err.message || "Ocurrió un error. Intenta de nuevo.");
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <TextInput
        style={[styles.input]}
        placeholder="Email or Phone"
        placeholderTextColor={"#aaa"}
        value={credentials}
        onChangeText={setCredentials}
      />

      <TextInput
        style={[styles.input]}
        placeholder="Password"
        placeholderTextColor={"#aaa"}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? (
        <ThemedText type="default" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}

      <View style={styles.rememberContainer}>
        <Checkbox
          value={rememberMe}
          onValueChange={() => setRememberMe(!rememberMe)}
          color={theme.primary}
        />
        <ThemedText
          type="default"
          style={[styles.rememberText, { color: theme.text }]}
        >
          Remember
        </ThemedText>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
      >
        <ThemedText
          type="default"
          style={[styles.loginButtonText, { color: "#fff" }]}
        >
          Login
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#1f2937",
    color: "#fff",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  rememberText: {
    marginLeft: 8,
  },
  loginButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  loginButtonText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  error: {
    color: "#f87171",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});

export default Login;
