import {
  Pressable,
  StyleSheet,
  Image,
  View,
  useColorScheme,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { Chat } from "@/models/chat";
import { User } from "@/models/user";
import { ServerUrl } from "@/constants/ServerUrl";
import { Colors } from "@/constants/Colors";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

interface Props {
  currentUser: User | null;
  allChats: Chat[] | null;
  onSelectChat: (chat: Chat) => void;
}

export default function AllConversations({
  allChats,
  currentUser,
  onSelectChat,
}: Props) {
  const SERVER_IMAGE_URL = `${ServerUrl}/UserProfilePicture`;

  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: theme.background, flex: 1 }}>
        {allChats && allChats.length > 0 ? (
          allChats.map((chat) => {
            return (
              <Pressable
                key={chat.Id}
                onPress={() => onSelectChat(chat)}
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
                        ? chat.UserDestination?.AvatarImageUrl || "default.png"
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
                      ? chat.ChatMessages[chat.ChatMessages.length - 1].Message
                          .length > 30
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
