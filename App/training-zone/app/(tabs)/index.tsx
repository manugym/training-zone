import { StyleSheet, Platform, Button } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import apiService from "@/services/api.service";

export default function HomeScreen() {
  const router = useRouter();

  const goToAuth = () => {
    router.push("/Auth");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome!
      </ThemedText>

      <ThemedText type="title" style={styles.title}>
        {apiService.jwt}
      </ThemedText>

      <Button title="Go to Auth" onPress={goToAuth} />
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
