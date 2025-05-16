import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import chatService from "@/services/chat.service";
import { User } from "@/models/user";
import { Chat } from "@/models/chat";
import Conversation from "@/components/Chat/Conversation";
import AllConversations from "@/components/Chat/AllConversations";
import userService from "@/services/user.service";
import websocketService from "@/services/websocket.service";
import apiService from "@/services/api.service";

export default function ChatView() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [allChats, setAllChats] = useState<Chat[] | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  //subscription to get the current user
  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setCurrentUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //Connect to the WebSocket server
  useEffect(() => {
    async function connectSocket() {
      console.log("Conectando el socket, JWT :", apiService.jwt);
      await websocketService.connect();
    }

    connectSocket();
  }, []);

  //subscription to get all users chats
  useEffect(() => {
    const subscription = chatService.allChats$.subscribe((chats) => {
      setAllChats(chats);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //subscription to get the current conversation
  useEffect(() => {
    const subscription = chatService.actualConversation$.subscribe((chat) => {
      setSelectedChat(chat);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //get all users chats request
  useEffect(() => {
    async function sendGetChatRequest() {
      await chatService.sendGetAllChatsRequest();
    }

    console.log("Sending get all chats request");

    sendGetChatRequest();
  }, []);

  //get all users chats request
  useEffect(() => {
    console.log("All Chats : ", allChats);
    console.log("Selected Chat : ", selectedChat);
    console.log("Current User : ", currentUser);
  }, [allChats, selectedChat, currentUser]);

  return (
    <ThemedView style={styles.container}>
      {selectedChat ? (
        <Conversation />
      ) : (
        <AllConversations
          allChats={allChats}
          currentUser={currentUser}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
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
