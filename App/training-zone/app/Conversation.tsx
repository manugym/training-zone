import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  useColorScheme,
} from "react-native";
import { Chat } from "@/models/chat";
import React, { useEffect, useRef, useState } from "react";
import chatService from "@/services/chat.service";
import { Stack } from "expo-router";
import { User } from "@/models/user";
import userService from "@/services/user.service";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function Conversation() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Chat | null>(null);

  const [messageToSend, setMessageToSend] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  //subscription to get the current user
  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setCurrentUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //subscription to get the current conversation
  useEffect(() => {
    const subscription = chatService.actualConversation$.subscribe((chat) => {
      setConversation(chat);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //Mark actual conversation as Viewed
  useEffect(() => {
    async function markConversationAsViewed() {
      await chatService.getConversationRequest(
        conversation.UserOriginId === currentUser.Id
          ? conversation.UserDestinationId
          : conversation.UserOriginId
      );
    }

    markConversationAsViewed();
  }, []);

  //If a message arrives and the user is in the conversation, it is marked as Viewed.
  useEffect(() => {
    async function markMessageAsViewed() {
      if (
        !conversation ||
        !conversation.ChatMessages ||
        conversation.ChatMessages.length === 0 ||
        !currentUser
      ) {
        return;
      }

      const latestMessage =
        conversation.ChatMessages[conversation.ChatMessages.length - 1];

      if (latestMessage.UserId !== currentUser.Id && !latestMessage.IsViewed) {
        await chatService.markMessageAsViewed(latestMessage.Id);
      }
    }

    markMessageAsViewed();
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!messageToSend.trim()) return;
    await chatService.sendMessage(messageToSend.trim());
    setMessageToSend("");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title:
            conversation?.UserOriginId === currentUser?.Id
              ? conversation?.UserDestination?.Name ?? "Conversation"
              : conversation?.UserOrigin?.Name ?? "Conversation",
        }}
      />

      <KeyboardAvoidingView
        style={[{ backgroundColor: theme.background }, styles.container]}
        keyboardVerticalOffset={80}
      >
        {/*All messages with scroll */}
        <ScrollView style={styles.messagesContainer} ref={scrollRef}>
          {conversation?.ChatMessages?.map((message) => {
            const isMine = message.UserId === currentUser?.Id;
            return (
              <View
                key={message.Id}
                style={[
                  { backgroundColor: isMine ? theme.primary : theme.secondary },
                  isMine ? styles.mine : styles.other,
                  styles.messageBox,
                ]}
              >
                <Text style={styles.messageText}>{message.Message}</Text>
                <View style={styles.messageInfo}>
                  <Text style={styles.messageTime}>
                    {new Date(message.MessageDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Text>
                  {isMine && (
                    <Ionicons
                      name="checkmark-done"
                      size={20}
                      color={message.IsViewed ? theme.details : theme.text}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/*Input */}
        <View
          style={[{ borderTopColor: theme.details }, styles.inputContainer]}
        >
          <TextInput
            value={messageToSend}
            onChangeText={setMessageToSend}
            placeholder="Escribe un mensaje"
            placeholderTextColor="#aaa"
            style={[{ borderColor: theme.details }, styles.input]}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={[styles.sendButton]}
          >
            <Ionicons name="send" size={30} color={theme.text} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    flex: 1,
  },
  messageBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: "75%",
  },
  mine: {
    alignSelf: "flex-end",
  },
  other: {
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  messageInfo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
    alignItems: "center",
    gap: 6,
  },
  messageTime: {
    fontSize: 12,
    color: "#fff",
  },
  statusIcon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
    padding: 12,
    borderTopWidth: 1,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#fff",
  },
  sendButton: {
    marginLeft: 10,
    padding: 8,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
});
