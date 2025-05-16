import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Chat } from "@/models/chat";
import { User } from "@/models/user";

interface Props {
  currentUser: User | null;
  allChats: Chat[] | null;
  selectedChat: Chat;
  onSelectChat: (chat: Chat) => void;
}

export default function AllConversations({
  allChats,
  currentUser,
  selectedChat,
  onSelectChat,
}: Props) {
  return (
    <ThemedView style={styles.container}>
      {allChats && allChats.length > 0 ? (
        allChats.map((chat) => (
          <Pressable key={chat.Id} onPress={() => onSelectChat(chat)}>
            <ThemedText type="title" style={styles.title}>
              {chat.UserOriginId === currentUser.Id
                ? chat.UserDestination?.Name
                : chat.UserOrigin?.Name}
            </ThemedText>
          </Pressable>
        ))
      ) : (
        <ThemedText type="title" style={styles.title}>
          No conversations available
        </ThemedText>
      )}
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
