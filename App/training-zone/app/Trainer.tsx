import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Calendar } from "react-native-calendars";
import { Text, Button, useTheme, ActivityIndicator } from "react-native-paper";
import trainerService from "@/services/trainer.service";
import chatService from "@/services/chat.service";
import websocketService from "@/services/websocket.service";
import apiService from "@/services/api.service";
import { ServerUrl } from "@/constants/ServerUrl";
import { User } from "@/models/user";
import { Trainer } from "@/models/trainer";
import { Class } from "@/models/class";
import { ClassType } from "@/models/enums/class-type";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";

export default function TrainerView() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("");
  const [classesOfSelectedDay, setClassesOfSelectedDay] = useState<
    Class[] | null
  >(null);

  useEffect(() => {
    if (!id) return;

    const fetchTrainer = async () => {
      try {
        const response = await trainerService.getTrainerById(Number(id));
        if (!response || !response.User) {
          throw new Error("Trainer or user info not found");
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
      return;
    }

    if (!websocketService.isConnected()) {
      await websocketService.connect();
      await chatService.sendGetAllChatsRequest();
    }

    let subscription: any;
    subscription = chatService.allChats$.subscribe((chats) => {
      if (chats) {
        chatService.newConversation(user);
        router.push("/Conversation");
        subscription?.unsubscribe();
      }
    });
  };

  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};

    if (!trainer?.TrainerClasses) return marked;

    trainer.TrainerClasses.forEach((c) => {
      c.Schedules.forEach((s) => {
        const classDate = new Date(s.StartDateTime);
        const dateString = classDate.toISOString().split("T")[0];

        marked[dateString] = {
          selected: true,
          selectedColor: theme.colors.secondary,
        };
      });
    });

    return marked;
  }, [trainer]);

  if (!id) {
    return (
      <View style={styles.viewContainer}>
        <Text variant="headlineMedium" style={{ textAlign: "center" }}>
          Trainer id not found
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.viewContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Stack.Screen options={{ title: trainer?.User?.Name ?? "Entrenador" }} />

      {trainer?.User && (
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
          {/* Trainer Info */}
          <View style={styles.trainerInfoContainer}>
            <Text
              variant="displayMedium"
              style={{ marginBottom: 30, textAlign: "center" }}
            >
              {trainer.User.Name}
            </Text>

            <View style={styles.trainerImageContainer}>
              <Image
                source={{
                  uri: `${ServerUrl}/${
                    trainer.User.AvatarImageUrl ||
                    "UserProfilePicture/default.png"
                  }`,
                }}
                style={styles.trainerImage}
                resizeMode="cover"
              />
            </View>

            <View style={{ marginTop: 20, alignItems: "center", gap: 10 }}>
              <Text
                variant="headlineMedium"
                style={{
                  textAlign: "center",
                  color: theme.colors.primary,
                  borderBottomColor: theme.colors.primary,
                  borderBottomWidth: 1,
                  paddingBottom: 4,
                }}
              >
                Especialidades
              </Text>

              {trainer.TrainerClasses.map((c, i) => (
                <Text
                  variant="titleLarge"
                  key={c.Id}
                  style={{
                    color:
                      i % 2 === 0
                        ? theme.colors.secondary
                        : theme.colors.outline,
                    textAlign: "center",
                  }}
                >
                  {ClassType[c.Type]}
                </Text>
              ))}
            </View>
          </View>

          {/* Schedule & Classes */}
          <View style={[styles.classesContainer, { gap: 20 }]}>
            <Text variant="titleLarge" style={styles.text}>
              Calendario de clases
            </Text>

            <Calendar
              onDayPress={(day) => setSelectedDay(day.dateString)}
              markedDates={{
                ...markedDates,
                ...(selectedDay && {
                  [selectedDay]: {
                    ...(markedDates[selectedDay] || {}),
                    selected: true,
                    selectedColor: theme.colors.primary,
                  },
                }),
              }}
              style={[styles.calendar, { borderColor: theme.colors.outline }]}
              theme={{
                backgroundColor: theme.colors.background,
                calendarBackground: theme.colors.background,
                textSectionTitleColor: theme.colors.onBackground,
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: theme.colors.onBackground,
                todayTextColor: theme.colors.secondary,
                dayTextColor: theme.colors.onBackground,
                arrowColor: theme.colors.secondary,
                monthTextColor: theme.colors.onBackground,
                textDayHeaderFontSize: 16,
                textDayHeaderFontWeight: "bold",
              }}
            />

            {selectedDay ? (
              classesOfSelectedDay && classesOfSelectedDay.length > 0 ? (
                <Table
                  borderStyle={{
                    borderWidth: 1,
                    borderColor: theme.colors.outline,
                  }}
                  style={{ marginTop: 20 }}
                >
                  <Row
                    data={["Tipo", "Descripción", "Acciones"]}
                    style={{
                      height: 40,
                      backgroundColor: theme.colors.primary,
                    }}
                    textStyle={{
                      color: theme.colors.onPrimary,
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
                        style={styles.tableCell}
                        data={ClassType[item.Type]}
                        textStyle={{
                          color: theme.colors.onBackground,
                          textAlign: "center",
                          padding: 8,
                        }}
                      />
                      <Cell
                        style={styles.tableCell}
                        data={item.Description}
                        textStyle={{
                          color: theme.colors.onBackground,
                          padding: 8,
                        }}
                      />
                      <Cell
                        style={styles.tableCell}
                        data={
                          <Button
                            mode="contained"
                            onPress={() => {
                              /* Implementar acción de ver las clases */
                            }}
                            style={{ marginBottom: 2 }}
                            contentStyle={{ paddingVertical: 6 }}
                            labelStyle={{ fontSize: 16 }}
                          >
                            Ver más
                          </Button>
                        }
                      />
                    </TableWrapper>
                  ))}
                </Table>
              ) : (
                <Text variant="titleLarge" style={styles.text}>
                  No hay clases disponibles este día
                </Text>
              )
            ) : (
              <Text variant="titleMedium" style={styles.text}>
                Selecciona un día resaltado para ver las clases disponibles.
              </Text>
            )}
          </View>

          <View style={styles.sendMessageContainer}>
            <Text variant="headlineMedium" style={{ textAlign: "center" }}>
              ¿Tienes alguna duda ?
            </Text>

            <Button
              mode="contained"
              onPress={() => handleClick(trainer.User)}
              style={styles.button}
              contentStyle={{ paddingVertical: 10 }}
              labelStyle={{ fontSize: 20 }}
            >
              Enviar Mensaje
            </Button>
          </View>
        </ScrollView>
      )}

      {loading && (
        <ActivityIndicator
          animating={true}
          size="large"
          style={{ marginTop: 20 }}
          color={theme.colors.primary}
        />
      )}
    </View>
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
    borderRadius: 8,
    overflow: "hidden",
  },
  trainerImage: {
    width: "100%",
    height: "100%",
  },
  button: {
    alignSelf: "center",
    borderRadius: 6,
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
  sendMessageContainer: {
    gap: 30,
    marginTop: 40,
  },

  tableCell: {
    flex: 1,
    alignItems: "center",
  },
});
