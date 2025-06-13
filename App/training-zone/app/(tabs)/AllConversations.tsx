import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  List,
  Text,
  useTheme,
  TouchableRipple,
} from "react-native-paper";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Stack, useRouter } from "expo-router";

import { Chat } from "@/models/chat";
import { User } from "@/models/user";
import { ServerUrl } from "@/constants/ServerUrl";
import chatService from "@/services/chat.service";
import websocketService from "@/services/websocket.service";
import userService from "@/services/user.service";
import { Shapes } from "@/constants/Shapes";
import { ThemedView } from "@/components/ThemedView";

export default function AllConversations() {
  const SERVER_IMAGE_URL = `${ServerUrl}/UserProfilePicture`;

  const theme = useTheme();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allChats, setAllChats] = useState<Chat[] | null>(null);

  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function connectSocket() {
      await websocketService.connect();
    }
    connectSocket();
  }, []);

  useEffect(() => {
    const subscription = chatService.allChats$.subscribe((chats) => {
      setAllChats(chats);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function sendGetChatRequest() {
      await chatService.sendGetAllChatsRequest();
    }
    sendGetChatRequest();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Your conversations" }} />

      <ThemedView style={{ height: "100%" }}>
        <GestureHandlerRootView style={{ flex: 1, paddingTop: 50 }}>
          <ScrollView
            style={{ backgroundColor: theme.colors.background, flex: 1 }}
          >
            {allChats && allChats.length > 0 ? (
              allChats.map((chat) => {
                const destinationUser =
                  chat.UserOriginId === currentUser?.Id
                    ? chat.UserDestination
                    : chat.UserOrigin;

                const lastMessage =
                  chat.ChatMessages && chat.ChatMessages.length > 0
                    ? chat.ChatMessages[chat.ChatMessages.length - 1]
                    : null;

                const lastMessageText = lastMessage
                  ? lastMessage.Message.length > 30
                    ? lastMessage.Message.slice(0, 30) + "..."
                    : lastMessage.Message
                  : "No hay mensajes";

                const lastMessageTime = lastMessage
                  ? new Date(lastMessage.MessageDateTime).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )
                  : "";

                const notViewedMessagesCounter =
                  chat.ChatMessages?.filter(
                    (message) =>
                      !message.IsViewed && message.UserId !== currentUser.Id
                  ).length || 0;

                return (
                  <TouchableRipple
                    key={chat.Id}
                    onPress={() => {
                      chatService.setActualConversation(chat);
                      router.push("/Conversation");
                    }}
                    style={[
                      styles.chatItem,
                      {
                        borderBottomColor: theme.colors.surface,
                        borderBottomWidth: 1,
                      },
                    ]}
                  >
                    <List.Item
                      title={destinationUser?.Name || "Usuario"}
                      titleStyle={{
                        color: theme.colors.onSurface,
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                      description={lastMessageText}
                      descriptionStyle={{
                        marginTop: 4,
                      }}
                      left={() => (
                        <Avatar.Image
                          size={50}
                          source={{
                            uri: `${SERVER_IMAGE_URL}/${
                              destinationUser?.AvatarImageUrl || "default.png"
                            }`,
                          }}
                          style={{
                            backgroundColor: "transparent",
                            borderColor: theme.colors.outline,
                            borderWidth: 1,
                            marginLeft: 12,
                          }}
                        />
                      )}
                      right={() => (
                        <View>
                          <Text>{lastMessageTime}</Text>
                          {notViewedMessagesCounter > 0 && (
                            <View
                              style={[
                                { backgroundColor: theme.colors.primary },
                                styles.counter,
                              ]}
                            >
                              <Text>{notViewedMessagesCounter}</Text>
                            </View>
                          )}
                        </View>
                      )}
                      style={{ paddingVertical: 8 }}
                    />
                  </TouchableRipple>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Text
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    ...theme.fonts.headlineSmall,
                    marginBottom: 8,
                  }}
                >
                  No tienes chats
                </Text>

                <Text
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    ...theme.fonts.bodyMedium,
                    opacity: 0.7,
                    textAlign: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  Envía un mensaje a un entrenador para iniciar una
                  conversación.
                </Text>
              </View>
            )}
          </ScrollView>
        </GestureHandlerRootView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    width: "100%",
  },
  timeContainer: {
    justifyContent: "center",
    paddingRight: 16,
  },
  emptyContainer: {
    marginTop: 30,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  counter: {
    marginTop: 4,
    borderRadius: Shapes.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
