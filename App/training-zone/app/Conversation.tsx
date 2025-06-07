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
  Alert,
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
import websocketService from "@/services/websocket.service";
import apiService from "@/services/api.service";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

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
  const inputRef = useRef<TextInput>(null);

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

  //Mark messages as viewed when the conversation changes or when new messages are added
  useEffect(() => {
    async function markMessagesAsViewed() {
      if (
        !conversation ||
        !conversation.ChatMessages ||
        conversation.ChatMessages.length === 0 ||
        !currentUser
      ) {
        return;
      }

      const notViewedMessages = conversation.ChatMessages.filter(
        (message) => message.UserId !== currentUser.Id && !message.IsViewed
      );

      for (const message of notViewedMessages) {
        await chatService.markMessageAsViewed(message.Id);
      }
    }

    markMessagesAsViewed();
  }, [conversation]);

  const handlePressOutsideTheMessage = () => {
    setMessageToEdit(null);
    setShowEditMessage(false);
    setMessageToEditContent("");
    Keyboard.dismiss();
  };

  const handlePressEditButton = (message: ChatMessage) => {
    setShowEditMessage(true);
    setMessageToEditContent(message.Message);
    inputRef.current?.focus();
  };

  const handleSendMessage = async () => {
    if (!messageToSend.trim()) return;
    await chatService.sendMessage(
      messageToSend.trim(),
      conversation.UserDestinationId === currentUser?.Id
        ? conversation.UserOriginId
        : conversation.UserDestinationId
    );
    setMessageToSend("");
  };

  const handleEditMessageSubmit = async () => {
    await chatService.sendEditMessageRequest(
      messageToEdit.Id,
      messageToEditContent
    );

    setMessageToEdit(null);
    setMessageToEditContent("");
  };

  const handleDeleteMessage = (messageId: number) => {
    Alert.alert(
      "¿Estás seguro de que quieres eliminar el mensaje?",
      "Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, eliminarlo",
          onPress: async () => {
            await chatService.sendDeleteMessageRequest(messageId);
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  // get the date in string
  const getDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <>
      {/*destination user name at the top */}
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
          handlePressOutsideTheMessage();
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
            {conversation &&
            conversation.ChatMessages &&
            conversation.ChatMessages.length > 0 ? (
              <>
                {conversation.ChatMessages?.map((message, index) => {
                  const isMine = message.UserId === currentUser?.Id;
                  const messageDate = new Date(message.MessageDateTime);

                  // check that the date changes
                  const showDateHeader =
                    index === 0 ||
                    new Date(
                      conversation.ChatMessages[index - 1].MessageDateTime
                    ).toDateString() !== messageDate.toDateString();

                  {
                    /*The message can be edited by long pressing it*/
                  }
                  return (
                    <React.Fragment key={message.Id}>
                      {showDateHeader && (
                        <View
                          style={[
                            { backgroundColor: theme.details },
                            styles.dateContainer,
                          ]}
                        >
                          <Text style={styles.dateText}>
                            {getDateLabel(messageDate)}
                          </Text>
                        </View>
                      )}

                      <TouchableOpacity
                        onLongPress={() => {
                          if (isMine) {
                            setMessageToEdit(message);
                            setMessageToEditContent("");
                          }
                        }}
                        activeOpacity={0.8}
                        style={[
                          {
                            backgroundColor:
                              messageToEdit === message
                                ? theme.details
                                : isMine
                                ? theme.primary
                                : theme.secondary,
                          },
                          isMine ? styles.mine : styles.other,
                          styles.messageBox,
                        ]}
                      >
                        {/*Edit and delete Icons */}
                        {messageToEdit && messageToEdit === message && (
                          <View style={styles.editButtons}>
                            <Entypo
                              name="edit"
                              size={20}
                              color="white"
                              onPress={() => handlePressEditButton(message)}
                            />
                            <MaterialCommunityIcons
                              name="delete-forever"
                              size={26}
                              color="red"
                              onPress={() => handleDeleteMessage(message.Id)}
                            />
                          </View>
                        )}

                        {/*Message */}
                        <Text style={styles.messageText}>
                          {message.Message}
                        </Text>
                        <View style={styles.messageInfo}>
                          <Text style={styles.messageTime}>
                            {new Date(
                              message.MessageDateTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </Text>
                          {isMine && (
                            <Ionicons
                              name="checkmark-done"
                              size={20}
                              color={message.IsViewed ? theme.details : "#ddd"}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <ThemedView style={styles.noMessagesContainer}>
                <ThemedText
                  style={[{ color: theme.primary }, styles.noMessagesTitle]}
                  type="title"
                >
                  No tienes mensajes con{" "}
                  <ThemedText style={{ color: theme.details }} type="title">
                    {conversation?.UserOriginId === currentUser?.Id
                      ? conversation?.UserDestination?.Name ?? "Entrenador"
                      : conversation?.UserOrigin?.Name ?? "Entrenador"}
                  </ThemedText>{" "}
                  aún.
                </ThemedText>
                <ThemedText style={styles.noMessagesSubtitle}>
                  Envía el primero para comenzar la conversación
                </ThemedText>
              </ThemedView>
            )}
          </ScrollView>

          {/*Input */}
          <View
            style={[{ borderTopColor: theme.details }, styles.inputContainer]}
          >
            <TextInput
              ref={inputRef}
              value={
                messageToEdit && showEditMessage
                  ? messageToEditContent
                  : messageToSend
              }
              onChangeText={
                messageToEdit && showEditMessage
                  ? setMessageToEditContent
                  : setMessageToSend
              }
              placeholder="Escribe un mensaje"
              placeholderTextColor="#aaa"
              style={[
                { borderColor: theme.details, color: theme.text },
                styles.input,
              ]}
              multiline
            />
            <TouchableOpacity
              onPress={
                messageToEdit && showEditMessage
                  ? handleEditMessageSubmit
                  : handleSendMessage
              }
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
  },
  sendButton: {
    marginLeft: 10,
    padding: 8,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  editButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },

  dateContainer: {
    alignSelf: "center",
    marginVertical: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  dateText: {
    color: "black",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },

  noMessagesContainer: {
    alignItems: "center",
    marginTop: 32,
    gap: 30,
  },

  noMessagesTitle: {
    textAlign: "center",
  },

  noMessagesSubtitle: {
    fontStyle: "italic",
    textAlign: "center",
  },
});
