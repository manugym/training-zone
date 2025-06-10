import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from "react-native";
import Dialog from "react-native-dialog";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogoutPress = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setShowLogoutDialog(false);
    await authService.logout();
    apiService.jwt = null;
    setCurrentUser(null);
    router.push("/Auth");
  };

  const logoSource = colorScheme === "dark" ? logoDark : logoLight;

  return (
    <ThemedView style={styles(theme).section}>
      <View style={styles(theme).sectionContent}>
        <View style={styles(theme).logoWrapper}>
          <Image
            source={logoSource}
            style={{
              width: 640,
              height: 560,
            }}
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
              onPress={handleLogoutPress}
            >
              <ThemedText style={styles(theme).registerText}>
                Cerrar sesión
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles(theme).authButtons}>
            <TouchableOpacity
              style={[styles(theme).button, styles(theme).loginButton]}
              onPress={() => router.push("/Auth")}
            >
              <ThemedText style={styles(theme).loginText}>
                Inicia Sesión
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles(theme).button, styles(theme).registerButton]}
              onPress={() => router.push("/Auth")}
            >
              <ThemedText style={styles(theme).registerText}>
                Regístrate
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {(Platform.OS === "android" || Platform.OS === "ios") && (
        <Dialog.Container visible={showLogoutDialog}>
          <Dialog.Title>¿Cerrar sesión?</Dialog.Title>
          <Dialog.Description>
            ¿Estás seguro de que quieres cerrar tu sesión?
          </Dialog.Description>
          <Dialog.Button label="Cancelar" onPress={() => setShowLogoutDialog(false)} />
          <Dialog.Button label="Cerrar sesión" onPress={confirmLogout} />
        </Dialog.Container>
      )}
    </ThemedView>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    section: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    sectionContent: {
      width: "100%",
      alignItems: "center",
    },
    logoWrapper: {
      paddingVertical: 16,
      width: "100%",
      alignItems: "center",
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
