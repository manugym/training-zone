import {
  View,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
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
import { Calendar } from "react-native-calendars";
import { Class } from "@/models/class";
import { ClassType } from "@/models/enums/class-type";

import { Table, TableWrapper, Row } from "react-native-table-component";
import { Cell } from "react-native-table-component";

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

  const [selectedDay, setSelectedDay] = useState("");
  const [classesOfSelectedDay, setClassesOfSelectedDay] = useState<
    Class[] | null
  >(null);

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

  useEffect(() => {
    if (!trainer || !selectedDay) return;

    const selectedDate = new Date(selectedDay);

    const matchingClasses = trainer.TrainerClasses.filter((classItem) =>
      classItem.Schedules.some((schedule) => {
        const scheduleDate = new Date(schedule.StartDateTime);
        return (
          scheduleDate.getFullYear() === selectedDate.getFullYear() &&
          scheduleDate.getMonth() === selectedDate.getMonth() &&
          scheduleDate.getDate() === selectedDate.getDate()
        );
      })
    );

    setClassesOfSelectedDay(matchingClasses);
  }, [selectedDay, trainer]);

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
              <ThemedText
                type="title"
                style={{ marginBottom: 30, textAlign: "center" }}
              >
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

              <View style={{ marginTop: 40, alignItems: "center", gap: 10 }}>
                <ThemedText
                  type="subtitle"
                  style={{
                    textAlign: "center",
                    color: theme.primary,
                    borderBottomColor: theme.primary,
                    borderBottomWidth: 1,
                    paddingBottom: 4,
                  }}
                >
                  Especialidades
                </ThemedText>

                {trainer.TrainerClasses.map((c, i) => (
                  <ThemedText
                    key={c.Id}
                    style={{
                      color: i % 2 === 0 ? theme.secondary : theme.details,
                      textAlign: "center",
                    }}
                  >
                    {ClassType[c.Type]}
                  </ThemedText>
                ))}
              </View>
            </View>
          </View>

          {/*Schedule and clases*/}
          <View style={[{ gap: 20 }, styles.classesContainer]}>
            <ThemedText type="subtitle" style={[{ fontSize: 24 }, styles.text]}>
              Calendario de clases
            </ThemedText>

            <Calendar
              onDayPress={(day) => setSelectedDay(day.dateString)}
              markedDates={{
                [selectedDay || ""]: {
                  selected: true,
                  selectedColor: theme.primary,
                },
              }}
              style={[{ borderColor: theme.details }, styles.calendar]}
              theme={{
                backgroundColor: theme.background,
                calendarBackground: theme.background,
                textSectionTitleColor: theme.text,
                selectedDayBackgroundColor: theme.primary,
                selectedDayTextColor: theme.text,
                todayTextColor: theme.details,
                todayButtonFontWeight: "bold",
                dayTextColor: theme.text,
                arrowColor: theme.details,
                monthTextColor: theme.text,
                textDayHeaderFontSize: 16,
                textDayHeaderFontWeight: "bold",
              }}
            />

            {selectedDay ? (
              classesOfSelectedDay && classesOfSelectedDay.length > 0 ? (
                <Table
                  borderStyle={{
                    borderWidth: 1,
                    borderColor: theme.details,
                  }}
                  style={{ marginTop: 20 }}
                >
                  <Row
                    data={["Tipo", "Descripción", "Acciones"]}
                    style={{ height: 40, backgroundColor: theme.primary }}
                    textStyle={{
                      color: theme.text,
                      fontWeight: "bold",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  />

                  {classesOfSelectedDay.map((item) => (
                    <TableWrapper
                      key={item.Id}
                      style={{ flexDirection: "row", height: 80 }}
                    >
                      <Cell
                        data={ClassType[item.Type]}
                        textStyle={{
                          ...styles.text,
                          color: theme.text,
                        }}
                      />
                      <Cell
                        data={item.Description}
                        textStyle={{
                          ...styles.text,
                          color: theme.text,
                        }}
                      />
                      <Cell
                        data={
                          <TouchableOpacity
                            style={[
                              {
                                backgroundColor: theme.primary,
                                marginBottom: 2,
                              },
                              styles.button,
                            ]}
                          >
                            <Text style={{ color: "#fff" }}>Ver más</Text>
                          </TouchableOpacity>
                        }
                      />
                    </TableWrapper>
                  ))}
                </Table>
              ) : (
                <ThemedText style={[{ fontSize: 20 }, styles.text]}>
                  No hay clases disponibles este día
                </ThemedText>
              )
            ) : (
              <ThemedText style={[{ fontSize: 20 }, styles.text]}>
                Selecciona un día resaltado en azul para ver las clases
                disponibles.
              </ThemedText>
            )}
          </View>

          <View style={{ gap: 12, marginTop: 40 }}>
            <ThemedText
              type="subtitle"
              style={{ fontSize: 24, textAlign: "center" }}
            >
              ¿Tienes alguna duda ?
            </ThemedText>

            <TouchableOpacity
              style={[{ backgroundColor: theme.primary }, styles.button]}
              onPress={() => handleClick(trainer.User)}
            >
              <ThemedText type="subtitle" style={{ fontSize: 18 }}>
                Enviar Mensaje
              </ThemedText>
            </TouchableOpacity>
          </View>
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

  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "center",
  },

  classesContainer: {
    flex: 1,
    padding: 20,
  },
  calendar: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    height: 350,
  },
});
