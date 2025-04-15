import React, { useEffect, useState } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import Checkbox from "expo-checkbox";
import { Colors } from "@/constants/Colors";

function Login() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useEffect(() => {
    console.log(credentials);
  }, [credentials]);

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
});

export default Login;
