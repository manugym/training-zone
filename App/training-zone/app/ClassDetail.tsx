import React, { useEffect, useState, useMemo } from "react";
import { View, Image, ScrollView, StyleSheet } from "react-native";
import { Text, Button, ActivityIndicator, useTheme } from "react-native-paper";
import { Stack, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import classService from "@/services/class.service";
import reservationService from "@/services/reservation.service";
import { ClassType } from "@/models/enums/class-type";
import { Schedule } from "@/models/schedule";
import { Reservation } from "@/models/reservation";
import { ServerUrl } from "@/constants/ServerUrl";
import { Shapes } from "@/constants/Shapes";
import { useTranslation } from "react-i18next";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function ClassDetail() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const { t } = useTranslation("class");
const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [classes, setClasses] = useState<Schedule[]>([]);
  const [reservationMap, setReservationMap] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SERVER_IMAGE_URL = `${ServerUrl}/ClassPicture`;

  const imageName = useMemo(() => {
    if (classes.length === 0) return "default";
    return ClassType[classes[0].ClassType]?.toLowerCase() || "default";
  }, [classes]);

  useEffect(() => {
    navigation.setOptions({ title: t("detailTitle") });

    if (!id || isNaN(Number(id))) return;
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const formattedDate = formatDate(selectedDay);
        const result = await classService.getClassesByDate(String(id), formattedDate);
        const reservations = await reservationService.getReservationsByUser();

        if (!isMounted) return;
        setClasses(result || []);
        const map = new Map<number, number>();
        reservations.forEach((r: Reservation) => map.set(r.ScheduleId, r.Id));
        setReservationMap(map);
      } catch (err) {
        if (!isMounted) return;
        setError(t("errorLoading"));
        setClasses([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, [selectedDay, id, t]);

  const themedStyles = {
    viewContainer: {
      backgroundColor: theme.colors.background,
    },
    classTitle: {
      color: theme.colors.primary,
      borderBottomColor: theme.colors.primary,
    },
    calendar: {
      borderColor: theme.colors.outline,
    },
    tableContainer: {
      borderColor: theme.colors.outline,
    },
    tableHeader: {
      backgroundColor: theme.colors.primary,
    },
    headerText: {
      color: theme.colors.onPrimary,
    },
    cell: {
      color: theme.colors.onSurface,
    },
    errorText: {
      color: theme.colors.error,
    },
  };

  return (
    <View style={[styles.viewContainer, themedStyles.viewContainer]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `${SERVER_IMAGE_URL}/${imageName}.jpg` }}
            style={styles.classImage}
            resizeMode="cover"
          />
        </View>
        <Text
          variant="headlineMedium"
          style={[styles.classTitle, themedStyles.classTitle]}
        >
          {ClassType[classes[0]?.ClassType]?.toLowerCase()}
        </Text>
        <Calendar
          onDayPress={(day) => setSelectedDay(new Date(day.dateString))}
          current={formatDate(selectedDay)}
          markedDates={{
            [formatDate(selectedDay)]: {
              selected: true,
              selectedColor: theme.colors.primary,
            },
          }}
          style={[styles.calendar, themedStyles.calendar]}
          theme={{
            backgroundColor: theme.colors.background,
            calendarBackground: theme.colors.background,
            textSectionTitleColor: theme.colors.onBackground,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.onPrimary,
            todayTextColor: theme.colors.secondary,
            dayTextColor: theme.colors.onBackground,
            arrowColor: theme.colors.secondary,
            monthTextColor: theme.colors.onBackground,
            textDayHeaderFontSize: 16,
            textDayHeaderFontWeight: "bold",
          }}
        />
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          {t("dayClasses")}
        </Text>
        {loading ? (
          <ActivityIndicator animating size="large" style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={themedStyles.errorText}>{error}</Text>
        ) : classes.length > 0 ? (
          <View style={[styles.tableContainer, themedStyles.tableContainer]}>
            <View style={[styles.tableHeader, themedStyles.tableHeader]}>
              <Text style={[styles.headerText, themedStyles.headerText, { flex: 1 }]}>{t("type")}</Text>
              <Text style={[styles.headerText, themedStyles.headerText, { flex: 1 }]}>{t("time")}</Text>
              <Text style={[styles.headerText, themedStyles.headerText, { flex: 1 }]}>{t("action")}</Text>
            </View>
            {classes.map((c) => {
              const reservationId = reservationMap.get(c.Id);
              return (
                <View key={c.Id} style={styles.tableRow}>
                  <Text style={[styles.cell, { flex: 1, color: theme.colors.secondary }]}>
                    {ClassType[c.ClassType]}
                  </Text>
                  <Text style={[styles.cell, { flex: 1, color: theme.colors.onSurface, fontWeight: "500" }]}>
                    {new Date(c.StartDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                  <View style={[styles.cell, { flex: 1, alignItems: "center" }]}>
                    {reservationId ? (
                      <Button
                        mode="outlined"
                        onPress={async () => {
                          await reservationService.deleteReservation(reservationId);
                          setSelectedDay(new Date(selectedDay));
                        }}
                        style={[styles.button, { borderColor: theme.colors.error }]}
                        textColor={theme.colors.error}
                        compact
                      >
                        {t("cancel")}
                      </Button>
                    ) : (
                      <Button
                        mode="contained"
                        onPress={async () => {
                          await reservationService.createReservation(c.Id);
                          setSelectedDay(new Date(selectedDay));
                        }}
                        style={[styles.button, { backgroundColor: theme.colors.primary }]}
                        textColor="#fff"
                        compact
                      >
                        {t("join")}
                      </Button>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noClassesText}>{t("noDayClasses")}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  classImage: {
    width: "100%",
    height: 170,
    borderRadius: Shapes.medium,
  },
  classTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 28,
    marginVertical: 18,
    letterSpacing: 0.5,
    borderBottomWidth: 1.5,
    paddingBottom: 5,
  },
  calendar: {
    borderWidth: 1,
    borderRadius: Shapes.small,
    padding: 12,
    marginBottom: 18,
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 18,
    marginTop: 8,
  },
  tableContainer: {
    width: "100%",
    marginTop: 10,
    gap: 10,
    borderRadius: Shapes.small,
    overflow: "hidden",
    borderWidth: 1,
  },
  tableHeader: {
    flexDirection: "row",
    borderTopLeftRadius: Shapes.small,
    borderTopRightRadius: Shapes.small,
    minHeight: 36,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  headerText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#dedede",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cell: {
    textAlign: "center",
    fontSize: 15,
    paddingHorizontal: 4,
    flex: 1,
  },
  button: {
    borderRadius: Shapes.small,
    minWidth: 84,
    minHeight: 32,
    alignSelf: "center",
    marginHorizontal: 2,
    paddingVertical: 1,
    paddingHorizontal: 2,
  },
  noClassesText: {
    textAlign: "center",
    marginVertical: 28,
    color: "#999",
    fontSize: 17,
  },
});