import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  useColorScheme,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import authService from "@/services/auth.service";

export default function Register() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [image, setImage] = useState<string>(null);

  const [error, setError] = useState("");

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Correo electrónico inválido.";
    if (!/^[0-9]{9}$/.test(phone)) return "El teléfono debe tener 9 dígitos.";
    if (password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    return "";
  };

  const handleSubmit = async () => {
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await authService.register(
        {
          name,
          phone,
          email,
          password,
          image,
        },
        rememberMe
      );

      Alert.alert("Registro exitoso", "¡Te has registrado correctamente!");
    } catch (err) {
      setError("Ocurrió un error. Intenta de nuevo.");
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
        <Image
          source={image ? { uri: image } : defaultAvatar}
          style={styles.profileImage}
        />
        <ThemedText type="default" style={styles.addImageText}>
          +
        </ThemedText>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        placeholderTextColor="#aaa"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
        style={[styles.registerButton, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
      >
        <ThemedText style={styles.registerButtonText}>Registrarse</ThemedText>
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
  imageContainer: {
    marginBottom: 20,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  addImageText: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#1565c0",
    color: "#fff",
    fontSize: 18,
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 24,
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
  error: {
    color: "#f87171",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  registerButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
