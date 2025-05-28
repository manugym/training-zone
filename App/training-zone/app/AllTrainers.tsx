import { ThemedText } from "@/components/ThemedText";
import Spinner from "@/components/ui/Spinner";
import { Colors } from "@/constants/Colors";
import { ServerUrl } from "@/constants/ServerUrl";
import { AllTrainers } from "@/models/all-trainers";
import { ClassType } from "@/models/enums/class-type";
import { TrainerFilter } from "@/models/trainer-filter";
import trainerService from "@/services/trainer.service";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function AllTrainersPage() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  `${ServerUrl}/UserProfilePicture`;

  const [allTrainers, setAllTrainers] = useState<AllTrainers | null>(null);

  const [classType, setClassType] = useState<ClassType | null>(null);
  const [name, setName] = useState<string>("");
  const [entitiesPerPage, setEntitiesPerPage] = useState<number>(5);
  const [actualPage, setActualPage] = useState<number>(1);

  // Initial filter
  const [filter, setFilter] = useState<TrainerFilter>({
    ClassType: null,
    Name: "",
    entitiesPerPage: 5,
    actualPage: 1,
  });

  const [loading, setLoading] = useState(false);

  // Handle filter changes
  useEffect(() => {
    setFilter({
      ClassType: classType,
      Name: name,
      entitiesPerPage: entitiesPerPage,
      actualPage: actualPage,
    });
  }, [classType, entitiesPerPage, actualPage]);

  // Debounce the name input to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        Name: name,
        actualPage: 1,
      }));
    }, 400);

    return () => clearTimeout(timer);
  }, [name]);

  // Fetch trainers when the filter changes
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);

        const allTrainers = await trainerService.getAllTrainers(filter);
        console.log("Trainers", allTrainers);
        setAllTrainers(allTrainers);
      } catch (error) {
        console.error("Error fetching trainers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [filter]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "All Trainers",
        }}
      />
      <ScrollView
        style={{ backgroundColor: theme.background }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.text },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Buscar entrenador..."
            placeholderTextColor={theme.text + "99"}
          />

          <Dropdown
            style={[styles.input, { borderColor: theme.text }]}
            data={[
              { label: "Todas las clases", value: null },
              ...Object.keys(ClassType)
                .filter((key) => isNaN(Number(key)))
                .map((key) => ({
                  label: key,
                  value: ClassType[key as keyof typeof ClassType],
                })),
            ]}
            labelField="label"
            valueField="value"
            placeholder="Selecciona clase"
            value={classType}
            onChange={(item) => setClassType(item.value)}
            placeholderStyle={{ color: theme.text + "99" }}
            selectedTextStyle={{ color: theme.text }}
            maxHeight={200}
          />
        </View>

        {!loading &&
          allTrainers &&
          allTrainers.Trainers.length > 0 &&
          allTrainers.Trainers.map((trainer, index) => (
            <View key={index}>
              <ThemedText key={index}>{trainer.User.Name}</ThemedText>
            </View>
          ))}

        {!loading && (!allTrainers || allTrainers.Trainers.length === 0) && (
          <ThemedText>No se encontraron entrenadores</ThemedText>
        )}

        {loading && <Spinner />}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: 10,
    marginVertical: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
    width: "100%",
  },
});
