import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Chat } from "@/models/chat";

interface Props {
  selectedChat: Chat;
}

export default function Conversation({ selectedChat }: Props) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {selectedChat.UserDestination.Name}
      </ThemedText>
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
