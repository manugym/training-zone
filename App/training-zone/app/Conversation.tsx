import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Chat } from "@/models/chat";
import React, { useEffect, useRef, useState } from "react";
import chatService from "@/services/chat.service";
import { Stack } from "expo-router";
import { User } from "@/models/user";
import userService from "@/services/user.service";
import { Colors } from "@/constants/Colors";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ChatMessage } from "@/models/chat-message";

export default function Conversation() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Chat | null>(null);

  const [messageToSend, setMessageToSend] = useState("");

  const [messageToEdit, setMessageToEdit] = useState<ChatMessage | null>(null);
  const [messageToEditContent, setMessageToEditContent] = useState("");
  const [showEditMessage, setShowEditMessage] = useState(false);

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
      {/*Clicking outside the message closes the edition and the keyboard*/}
      <TouchableWithoutFeedback
        onPress={() => {
          setMessageToEdit(null);
          setShowEditMessage(false);
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          style={[{ backgroundColor: theme.background }, styles.container]}
          keyboardVerticalOffset={80}
        >
          {/*All messages with scroll */}
          <ScrollView
            style={styles.messagesContainer}
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
          >
            {conversation?.ChatMessages?.map((message) => {
              const isMine = message.UserId === currentUser?.Id;
              {
                /*The message can be edited by long pressing it*/
              }
              return (
                <TouchableOpacity
                  key={message.Id}
                  onLongPress={() => {
                    if (isMine) {
                      setMessageToEdit(message);
                    }
                  }}
                  activeOpacity={0.8}
                  style={[
                    {
                      backgroundColor: isMine ? theme.primary : theme.secondary,
                    },
                    isMine ? styles.mine : styles.other,
                    styles.messageBox,
                  ]}
                >
                  {/*Edit and delete Icons */}
                  {messageToEdit && messageToEdit === message && (
                    <View>
                      <Entypo
                        name="edit"
                        size={20}
                        color="white"
                        onPress={() => setShowEditMessage(true)}
                      />
                      <MaterialCommunityIcons
                        name="delete-forever"
                        size={26}
                        color="red"
                      />
                    </View>
                  )}

                  {/*Message */}
                  <Text style={styles.messageText}>{message.Message}</Text>
                  <View style={styles.messageInfo}>
                    <Text style={styles.messageTime}>
                      {new Date(message.MessageDateTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }
                      )}
                    </Text>
                    {isMine && (
                      <Ionicons
                        name="checkmark-done"
                        size={20}
                        color={message.IsViewed ? theme.details : theme.text}
                      />
                    )}
                  </View>
                </TouchableOpacity>
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
      </TouchableWithoutFeedback>
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
