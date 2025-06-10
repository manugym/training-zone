import React, { useEffect, useState } from "react";
import { StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import { Shapes } from "@/constants/Shapes";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TextInput, Button, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import Toast from "react-native-toast-message";
import userService from "@/services/user.service";
import apiService from "@/services/api.service";
import authService from "@/services/auth.service";
import { ServerUrl } from "@/constants/ServerUrl";

export default function UserProfile() {
  const SERVER_IMAGE_URL = `${ServerUrl}/UserProfilePicture`;

  const theme = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!apiService.jwt) {
      Alert.alert("Necesitas iniciar sesión");
      router.push("/Auth");
    }

    async function loadCurrentUser() {
      if (!userService.getCurrentUser()) await userService.loadCurrentUser();
    }

    loadCurrentUser();
  }, []);

  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setName(user.Name || "");
      setEmail(user.Email || "");
      setPhone(user.Phone || "");

      if (user.AvatarImageUrl)
        setImage(`${SERVER_IMAGE_URL}/${user.AvatarImageUrl}`);
    });

    return () => subscription.unsubscribe();
  }, []);

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

    if (!email || !emailRegex.test(email)) return "Correo inválido.";
    if (!phone || !phoneRegex.test(phone)) return "Teléfono inválido.";
    if (password && password.length < 6) return "Contraseña muy corta.";
    if (password && password !== confirmPassword)
      return "Las contraseñas no coinciden.";

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
      await userService.editUseData({
        name,
        phone,
        email,
        password,
        image,
      });

      Alert.alert("¡Datos actualizados correctamente correctamente!");

      if (password) {
        authService.logout();
        Alert.alert("Necesitas iniciar sesión de nuevo");
        router.push("/Auth");
      }
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
        onChangeText={(text) => setEmail(text.trim())}
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
        onChangeText={(text) => setPhone(text.trim())}
        mode="outlined"
        keyboardType="phone-pad"
        theme={{
          colors: {
            primary: theme.colors.surface,
          },
        }}
      />
      <TextInput
        label="Contraseña (opcional)"
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
        style={{
          borderRadius: Shapes.medium,
        }}
      >
        Actualizar
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
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
    borderRadius: Shapes.pill,
  },
  addImageText: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#1565c0",
    color: "#fff",
    fontSize: 18,
    borderRadius: Shapes.pill,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 24,
  },
});
