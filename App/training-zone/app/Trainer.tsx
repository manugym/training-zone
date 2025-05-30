import {
  View,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ServerUrl } from "@/constants/ServerUrl";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import trainerService from "@/services/trainer.service";
import chatService from "@/services/chat.service";
import { User } from "@/models/user";
import { Trainer } from "@/models/trainer";
import Spinner from "@/components/ui/Spinner";
import websocketService from "@/services/websocket.service";
import apiService from "@/services/api.service";

export default function TrainerView() {
  const SERVER_IMAGE_URL = `${ServerUrl}/UserProfilePicture`;
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const { id } = useLocalSearchParams();

  if (!id) {
    return (
      <ThemedView style={styles.viewContainer}>
        <ThemedText type="title" style={{ textAlign: "center" }}>
          Trainer id not found
        </ThemedText>
      </ThemedView>
    );
  }

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);

  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const [selectedDay, setSelectedDay] = useState<Value | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await trainerService.getTrainerById(Number(id));
        console.log("Trainer response:", response);
        if (!response || !response.User) {
          throw new Error("Trainer o información del usuario no encontrada");
        }

        setTrainer(response);
      } catch (error) {
        console.error("Error fetching trainer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  const handleClick = async (user: User) => {
    if (!apiService.jwt) {
      alert("Necesitas iniciar sesión");
      router.push("/Auth");
    }

    if (!websocketService.isConnected()) {
      await websocketService.connect();
      await chatService.sendGetAllChatsRequest();
    }

    // Wait for the chat service to load all chats before creating a new conversation
    let subscription: any;
    subscription = chatService.allChats$.subscribe((chats) => {
      if (chats) {
        chatService.newConversation(user);
        router.push("/Conversation");
        subscription?.unsubscribe();
      }
    });
  };

  return (
    <ThemedView style={styles.viewContainer}>
      <Stack.Screen
        options={{
          title: trainer?.User?.Name ?? "Entrenador",
        }}
      />

      {trainer?.User && (
        <ScrollView
          style={{ backgroundColor: theme.background }}
          keyboardShouldPersistTaps="handled"
        >
          {/*Trainer Information */}
          <View style={styles.trainerInfoContainer}>
            <View>
              <ThemedText type="title" style={styles.text}>
                {trainer.User.Name}
              </ThemedText>

              <View style={styles.trainerImageContainer}>
                <Image
                  source={{
                    uri: `${SERVER_IMAGE_URL}/${
                      trainer.User.AvatarImageUrl || "default.png"
                    }`,
                  }}
                  style={styles.trainerImage}
                  resizeMode="cover"
                />
              </View>

              <ThemedText style={[{ fontSize: 18 }, styles.text]}>
                Especialidades
              </ThemedText>
            </View>

            <View style={{ gap: 12 }}>
              <ThemedText type="subtitle" style={{ fontSize: 24 }}>
                ¿Tienes alguna duda ?
              </ThemedText>

              <TouchableOpacity
                style={[
                  { backgroundColor: theme.primary },
                  styles.setMessageButton,
                ]}
                onPress={() => handleClick(trainer.User)}
              >
                <ThemedText type="subtitle" style={{ fontSize: 18 }}>
                  Enviar Mensaje
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/*Schedule and clases*/}
          <View></View>
        </ScrollView>
      )}

      {loading && <Spinner />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },

  text: {
    textAlign: "center",
    paddingVertical: 12,
  },

  trainerInfoContainer: {
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 30,
  },

  trainerImageContainer: {
    width: "80%",
    aspectRatio: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  trainerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  setMessageButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "center",
  },
});
