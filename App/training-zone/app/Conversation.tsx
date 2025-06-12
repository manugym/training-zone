import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  TouchableWithoutFeedback,
  View,
  Animated,
} from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import {
  Text,
  TextInput,
  IconButton,
  useTheme,
  Surface,
  TouchableRipple,
} from "react-native-paper";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import chatService from "@/services/chat.service";
import userService from "@/services/user.service";
import { User } from "@/models/user";
import { Chat } from "@/models/chat";
import { ChatMessage } from "@/models/chat-message";
import { Shapes } from "@/constants/Shapes";

export default function Conversation() {
  const theme = useTheme();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Chat | null>(null);

  const [messageToSend, setMessageToSend] = useState("");
  const [messageToEdit, setMessageToEdit] = useState<ChatMessage | null>(null);
  const [messageToEditContent, setMessageToEditContent] = useState("");
  const [showEditMessage, setShowEditMessage] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<any>(null);

  const animatedValuesRef = useRef<{ [key: number]: Animated.Value }>({});

  useFocusEffect(
    useCallback(() => {
      return () => {
        chatService.setActualConversation(null);
      };
    }, [])
  );

  // Scroll to the end of the conversation when it updates
  useEffect(() => {
    if (scrollRef.current && conversation?.ChatMessages?.length > 0) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation?.ChatMessages]);

  useEffect(() => {
    const subscription = userService.currentUser$.subscribe(setCurrentUser);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription =
      chatService.actualConversation$.subscribe(setConversation);
    return () => subscription.unsubscribe();
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
        (msg) => msg.UserId !== currentUser.Id && !msg.IsViewed
      );
      for (const msg of notViewedMessages) {
        await chatService.markMessageAsViewed(msg.Id);
      }
    }
    markMessagesAsViewed();
  }, [conversation, currentUser]);

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
      conversation?.UserDestinationId === currentUser?.Id
        ? conversation.UserOriginId
        : conversation?.UserDestinationId
    );
    setMessageToSend("");
  };

  const handleEditMessageSubmit = async () => {
    if (!messageToEdit) return;
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
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminarlo",
          style: "destructive",
          onPress: () => {
            Animated.timing(animatedValuesRef.current[messageId], {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(async () => {
              await chatService.sendDeleteMessageRequest(messageId);
            });
          },
        },
      ]
    );
  };

  // get the date in string
  const getDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Hoy";
    if (date.toDateString() === yesterday.toDateString()) return "Ayer";

    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
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
      <TouchableWithoutFeedback onPress={handlePressOutsideTheMessage}>
        <KeyboardAvoidingView
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
          keyboardVerticalOffset={80}
          behavior="padding"
        >
          {/*All messages with scroll */}
          <ScrollView
            style={styles.messagesContainer}
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
          >
            {conversation?.ChatMessages?.length ? (
              conversation.ChatMessages.map((message, index) => {
                const isMine = message.UserId === currentUser?.Id;
                const messageDate = new Date(message.MessageDateTime);

                if (!animatedValuesRef.current[message.Id]) {
                  animatedValuesRef.current[message.Id] = new Animated.Value(1);
                }

                const animatedStyle = {
                  opacity: animatedValuesRef.current[message.Id],
                  transform: [
                    {
                      scale: animatedValuesRef.current[message.Id],
                    },
                  ],
                };

                const showDateHeader =
                  index === 0 ||
                  new Date(
                    conversation.ChatMessages[index - 1].MessageDateTime
                  ).toDateString() !== messageDate.toDateString();

                return (
                  <React.Fragment key={message.Id}>
                    {showDateHeader && (
                      <Surface
                        style={[
                          styles.dateContainer,
                          { backgroundColor: theme.colors.secondaryContainer },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateText,
                            { color: theme.colors.onSecondaryContainer },
                          ]}
                        >
                          {getDateLabel(messageDate)}
                        </Text>
                      </Surface>
                    )}

                    <Animated.View style={[animatedStyle]}>
                      <TouchableRipple
                        onLongPress={() => {
                          if (isMine) {
                            setMessageToEdit(message);
                            inputRef.current?.focus();
                          }
                        }}
                        style={[
                          styles.messageBox,
                          {
                            backgroundColor:
                              messageToEdit === message
                                ? theme.colors.secondaryContainer
                                : isMine
                                ? theme.colors.primary
                                : theme.colors.secondary,
                            alignSelf: isMine ? "flex-end" : "flex-start",
                            borderBottomRightRadius: isMine ? 0 : undefined,
                            borderBottomLeftRadius: isMine ? undefined : 0,
                          },
                        ]}
                      >
                        <View>
                          {messageToEdit === message && (
                            <View style={styles.editButtons}>
                              <IconButton
                                icon={() => (
                                  <Entypo
                                    name="edit"
                                    size={20}
                                    color={theme.colors.onPrimary}
                                  />
                                )}
                                size={24}
                                onPress={() => handlePressEditButton(message)}
                              />
                              <IconButton
                                icon={() => (
                                  <MaterialCommunityIcons
                                    name="delete-forever"
                                    size={26}
                                    color={theme.colors.error}
                                  />
                                )}
                                size={26}
                                onPress={() => handleDeleteMessage(message.Id)}
                              />
                            </View>
                          )}
                          <Text
                            style={[
                              styles.messageText,
                              { color: theme.colors.onPrimary },
                            ]}
                          >
                            {message.Message}
                          </Text>
                          <View style={styles.messageInfo}>
                            <Text
                              style={[
                                styles.messageTime,
                                { color: theme.colors.onPrimary },
                              ]}
                            >
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
                                color={
                                  message.IsViewed
                                    ? theme.colors.surface
                                    : "#ddd"
                                }
                              />
                            )}
                          </View>
                        </View>
                      </TouchableRipple>
                    </Animated.View>
                  </React.Fragment>
                );
              })
            ) : (
              <View style={styles.noMessagesContainer}>
                <Text
                  style={[
                    styles.noMessagesTitle,
                    { color: theme.colors.primary },
                  ]}
                  variant="titleLarge"
                >
                  No tienes mensajes con{" "}
                  <Text
                    style={{ color: theme.colors.secondary }}
                    variant="titleLarge"
                  >
                    {conversation?.UserOriginId === currentUser?.Id
                      ? conversation?.UserDestination?.Name ?? "Entrenador"
                      : conversation?.UserOrigin?.Name ?? "Entrenador"}
                  </Text>{" "}
                  aún.
                </Text>
                <Text style={styles.noMessagesSubtitle} variant="bodyMedium">
                  Envía el primero para comenzar la conversación
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Input area */}
          <View
            style={[
              styles.inputContainer,
              { borderTopColor: theme.colors.outline },
            ]}
          >
            <TextInput
              label="Escribe un mensaje"
              ref={inputRef}
              mode="outlined"
              multiline
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
              style={styles.input}
              onSubmitEditing={() => {
                if (messageToEdit && showEditMessage) {
                  handleEditMessageSubmit();
                } else {
                  handleSendMessage();
                }
              }}
              returnKeyType="send"
              theme={{
                colors: {
                  primary: theme.colors.surface,
                },
              }}
            />
            <IconButton
              icon="send"
              size={30}
              onPress={
                messageToEdit && showEditMessage
                  ? handleEditMessageSubmit
                  : handleSendMessage
              }
              disabled={
                messageToEdit && showEditMessage
                  ? !messageToEditContent.trim()
                  : !messageToSend.trim()
              }
              iconColor={theme.colors.primary}
              style={styles.sendButton}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messagesContainer: { paddingHorizontal: 12, paddingTop: 12, flex: 1 },
  messageBox: {
    padding: 10,
    borderRadius: Shapes.medium,
    marginBottom: 8,
    maxWidth: "75%",
  },
  messageText: { fontSize: 16 },
  messageInfo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
    alignItems: "center",
    gap: 6,
  },
  messageTime: { fontSize: 12 },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
    padding: 12,
    borderTopWidth: 1,
    alignItems: "flex-end",
  },
  input: { flex: 1, minHeight: 40, maxHeight: 100 },
  sendButton: { marginLeft: 10 },
  editButtons: { flexDirection: "row", gap: 8, marginBottom: 6 },
  dateContainer: {
    alignSelf: "center",
    marginVertical: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Shapes.small,
    elevation: 2,
  },
  dateText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  noMessagesContainer: {
    alignItems: "center",
    marginTop: 32,
    gap: 30,
  },
  noMessagesTitle: { textAlign: "center" },
  noMessagesSubtitle: {
    fontStyle: "italic",
    textAlign: "center",
  },
});
