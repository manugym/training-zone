import { StyleSheet } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Chat } from "@/models/chat";
import { useEffect, useState } from "react";
import chatService from "@/services/chat.service";

export default function Conversation() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  //subscription to get the current conversation
  useEffect(() => {
    const subscription = chatService.actualConversation$.subscribe((chat) => {
      setSelectedChat(chat);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log("Selected Chat : ", selectedChat);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {selectedChat?.UserDestination.Name}
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
