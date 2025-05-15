import { StyleSheet, Platform, Button, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import apiService from "@/services/api.service";
import userService from "@/services/user.service";
import { useEffect, useState } from "react";
import { User } from "@/models/user";
import authService from "@/services/auth.service";

export default function HomeScreen() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const goToAuth = () => {
    router.push("/Auth");
  };

  useEffect(() => {
    async function isUserLogin() {
      await apiService.initializeJwt();
      if (!apiService.jwt) {
        Alert.alert("!Bienvenido!", "Inicia sesión para continuar");
        goToAuth();
      }
    }

    isUserLogin();
  }, [currentUser]);

  //subscription to get the current user
  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setCurrentUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome! {currentUser?.Name}
      </ThemedText>

      <Button title="Go to Auth" onPress={goToAuth} />
      <Button
        title="Logout"
        onPress={async () => {
          await authService.logout();
          goToAuth();
        }}
      />
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
