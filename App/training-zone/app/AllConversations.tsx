import {
  Pressable,
  StyleSheet,
  Image,
  View,
  useColorScheme,
} from "react-native";
import { ThemedText } from "../components/ThemedText";
import { Chat } from "@/models/chat";
import { User } from "@/models/user";
import { ServerUrl } from "@/constants/ServerUrl";
import { Colors } from "@/constants/Colors";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import chatService from "@/services/chat.service";
import websocketService from "@/services/websocket.service";
import apiService from "@/services/api.service";
import userService from "@/services/user.service";
import { Stack, useRouter } from "expo-router";

export default function AllConversations() {
  const SERVER_IMAGE_URL = `${ServerUrl}/UserProfilePicture`;
  const router = useRouter();

  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allChats, setAllChats] = useState<Chat[] | null>(null);

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

  //get all users chats request
  useEffect(() => {
    async function sendGetChatRequest() {
      await chatService.sendGetAllChatsRequest();
    }

    console.log("Sending get all chats request");

    sendGetChatRequest();
  }, []);

  console.log(allChats);

  return (
    <>
      <Stack.Screen options={{ title: "Your conversations" }} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: theme.background, flex: 1 }}>
          {allChats && allChats.length > 0 ? (
            allChats.map((chat) => {
              return (
                <Pressable
                  key={chat.Id}
                  onPress={() => {
                    chatService.setActualConversation(chat);
                    router.push("/Conversation");
                  }}
                  style={[
                    styles.chatItem,
                    { borderBottomColor: theme.details, borderBottomWidth: 2 },
                  ]}
                >
                  {" "}
                  <Image
                    source={{
                      uri: `${SERVER_IMAGE_URL}/${
                        chat.UserOriginId === currentUser?.Id
                          ? chat.UserDestination?.AvatarImageUrl ||
                            "default.png"
                          : chat.UserOrigin?.AvatarImageUrl || "default.png"
                      }`,
                    }}
                    style={[
                      { borderColor: theme.details, borderWidth: 2 },
                      styles.avatar,
                    ]}
                  />
                  <View style={styles.chatInfo}>
                    <ThemedText
                      type="subtitle"
                      style={[styles.chatName, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {chat.UserOriginId === currentUser?.Id
                        ? chat.UserDestination?.Name
                        : chat.UserOrigin?.Name}
                    </ThemedText>

                    <ThemedText
                      type="default"
                      style={[styles.lastMessage, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {chat.ChatMessages && chat.ChatMessages.length > 0
                        ? chat.ChatMessages[chat.ChatMessages.length - 1]
                            .Message.length > 30
                          ? chat.ChatMessages[
                              chat.ChatMessages.length - 1
                            ].Message.slice(0, 30) + "..."
                          : chat.ChatMessages[chat.ChatMessages.length - 1]
                              .Message
                        : "No hay mensajes"}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="default"
                    style={[styles.messageTime, { color: theme.text }]}
                  >
                    {chat.ChatMessages && chat.ChatMessages.length > 0
                      ? new Date(
                          chat.ChatMessages[
                            chat.ChatMessages.length - 1
                          ].MessageDateTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : ""}
                  </ThemedText>
                </Pressable>
              );
            })
          ) : (
            <ThemedText type="default" style={{ color: theme.text }}>
              Sin chats
            </ThemedText>
          )}
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  lastMessage: {
    marginTop: 2,
    opacity: 0.8,
  },
  messageTime: {
    fontSize: 12,
    marginLeft: 8,
    opacity: 0.8,
  },
});
