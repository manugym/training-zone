import React, { useState } from "react";
import { StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TextInput, Button, useTheme } from "react-native-paper";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import authService from "@/services/auth.service";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function Register() {
  const theme = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9}$/;
    if (!emailRegex.test(email.trim())) return "Correo electrónico inválido.";
    if (phoneRegex.test(phone.trim()))
      return "El teléfono debe tener 9 dígitos.";
    if (password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: validationError,
        position: "bottom",
      });
      return;
    }

    try {
      await authService.register({
        name,
        phone,
        email,
        password,
        image,
      });

      Alert.alert("Registro exitoso", "¡Te has registrado correctamente!");
      router.push("/");
    } catch (err) {
      const message = err.message || "Ocurrió un error. Intenta de nuevo.";

      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "bottom",
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
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
        label="Nombre completo"
        value={name}
        onChangeText={setName}
        mode="outlined"
        theme={{
          colors: {
            primary: theme.colors.surface,
          },
        }}
      />
      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
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
        label="Teléfono"
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        keyboardType="phone-pad"
        theme={{
          colors: {
            primary: theme.colors.surface,
          },
        }}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        theme={{
          colors: {
            primary: theme.colors.surface,
          },
        }}
      />
      <TextInput
        label="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        secureTextEntry
        theme={{
          colors: {
            primary: theme.colors.surface,
          },
        }}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        labelStyle={{ fontSize: 18, paddingVertical: 6 }}
      >
        Registrarse
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

  imageContainer: {
    marginBottom: 20,
    position: "relative",
    alignSelf: "center",
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
});
