import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, useColorScheme, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import userService from "@/services/user.service";
import apiService from "@/services/api.service";
import authService from "@/services/auth.service";
import { Colors } from "@/constants/Colors";

const logoLight = require("@/assets/images/home-logo-light.png");
const logoDark = require("@/assets/images/home-logo-dark.png");

export default function SectionLogReg() {
  const router = useRouter();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await authService.logout();
            apiService.jwt = null;
            setCurrentUser(null);
            router.push("/Auth");
          },
        },
      ]
    );
  };

  const logoSource = colorScheme === "dark" ? logoDark : logoLight;

  return (
    <ThemedView style={styles(theme).section}>
      <View style={styles(theme).sectionContent}>
        <View style={styles(theme).logoWrapper}>
          <Image
            source={logoSource}
            style={styles(theme).logo}
            resizeMode="contain"
          />
        </View>
        {currentUser ? (
          <View style={styles(theme).authButtons}>
            <ThemedText style={styles(theme).welcomeText}>
              ¡Hola, {currentUser.Name}!
            </ThemedText>
            <TouchableOpacity
              style={[styles(theme).button, styles(theme).registerButton]}
              onPress={handleLogout}
            >
              <ThemedText style={styles(theme).registerText}>Cerrar sesión</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles(theme).authButtons}>
            <TouchableOpacity
              style={[styles(theme).button, styles(theme).loginButton]}
              onPress={() => router.push("/Auth")}
            >
              <ThemedText style={styles(theme).loginText}>Inicia Sesión</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles(theme).button, styles(theme).registerButton]}
              onPress={() => router.push("/Auth")}
            >
              <ThemedText style={styles(theme).registerText}>Regístrate</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  section: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: theme.background,
  },
  sectionContent: {
    width: "100%",
    alignItems: "center",
  },
  logoWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 48,
  },
  logo: {
    width: 600,    
    height: 480, 
  },
  authButtons: {
    width: "90%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 99,
    alignItems: "center",
    marginVertical: 8,
    width: "80%",
  },
  loginButton: {
    backgroundColor: theme.secondary,
  },
  registerButton: {
    backgroundColor: theme.primary,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  welcomeText: {
    color: theme.text,
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
});
