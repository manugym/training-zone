import { StyleSheet, Alert } from "react-native";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import apiService from "@/services/api.service";
import userService from "@/services/user.service";
import authService from "@/services/auth.service";
import { User } from "@/models/user";

export default function HomeScreen() {
  const router = useRouter();

  const theme = useTheme();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function isUserLogin() {
      await apiService.initializeJwt();
      if (!apiService.jwt) {
        Alert.alert("¡Bienvenido!", "Inicia sesión para continuar");
        router.push("/Auth");
      }
    }
    isUserLogin();
  }, [currentUser]);

  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      elevation={0}
    >
      <Text variant="displayMedium" style={styles.title}>
        Welcome! {currentUser?.Name}
      </Text>
      <Button
        mode="contained"
        onPress={() => router.push("/Auth")}
        style={styles.button}
      >
        Go to Auth
      </Button>
      <Button
        mode="contained"
        onPress={async () => {
          await authService.logout();
          router.push("/Auth");
        }}
        style={styles.button}
      >
        Logout
      </Button>
      <Button
        mode="contained"
        onPress={() => router.push("/AllConversations")}
        style={styles.button}
      >
        Chat
      </Button>
      <Button
        mode="contained"
        onPress={() => router.push("/AllTrainers")}
        style={styles.button}
      >
        All Trainers
      </Button>
    </Surface>
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
  button: {
    marginVertical: 6,
    width: "80%",
  },
});
