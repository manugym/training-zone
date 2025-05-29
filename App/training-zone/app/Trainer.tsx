import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

function Trainer() {
  const { id } = useLocalSearchParams();

  return (
    <ThemedView>
      <ThemedText type="title">Trainer ID: {id}</ThemedText>
    </ThemedView>
  );
}

export default Trainer;
