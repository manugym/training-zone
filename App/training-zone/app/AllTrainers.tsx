import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Spinner from "@/components/ui/Spinner";
import { Colors } from "@/constants/Colors";
import { ServerUrl } from "@/constants/ServerUrl";
import { AllTrainers } from "@/models/all-trainers";
import { ClassType } from "@/models/enums/class-type";
import { TrainerFilter } from "@/models/trainer-filter";
import trainerService from "@/services/trainer.service";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  View,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function AllTrainersPage() {
  const router = useRouter();

  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const SERVER_IMAGE_URL = `${ServerUrl}/UserProfilePicture`;

  const [allTrainers, setAllTrainers] = useState<AllTrainers | null>(null);

  const [classType, setClassType] = useState<ClassType | null>(null);
  const [name, setName] = useState<string>("");

  // Initial filter
  const [filter, setFilter] = useState<TrainerFilter>({
    ClassType: null,
    Name: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle filter changes
  useEffect(() => {
    setFilter({
      ClassType: classType,
      Name: name,
    });
  }, [classType]);

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
    <ThemedView style={styles.viewContainer}>
      <Stack.Screen
        options={{
          title: "All Trainers",
        }}
      />

      {/*Searcher */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.text }]}
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

      {/*Trainers List */}
      <ScrollView
        style={{ backgroundColor: theme.background }}
        keyboardShouldPersistTaps="handled"
      >
        {allTrainers && allTrainers.Trainers.length > 0 && (
          <View style={styles.trainersGrid}>
            {allTrainers.Trainers.map((trainer) => (
              <View
                key={trainer.User.Id}
                style={[{ borderColor: theme.details }, styles.trainerCard]}
              >
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
                <View style={styles.trainerInfo}>
                  <View style={styles.trainerInfoTop}>
                    <ThemedText type="subtitle">{trainer.User.Name}</ThemedText>

                    <ThemedText style={{ color: theme.secondary }}>
                      Especialidades
                    </ThemedText>
                  </View>
                  <TouchableOpacity
                    style={[
                      { backgroundColor: theme.primary },
                      styles.profileButton,
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: "/Trainer",
                        params: { id: trainer.User.Id },
                      })
                    }
                  >
                    <ThemedText type="subtitle" style={{ fontSize: 18 }}>
                      Ver Perfil
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {!loading && (!allTrainers || allTrainers.Trainers.length === 0) && (
          <View style={styles.noResultsContainer}>
            <ThemedText type="subtitle">
              No se encontraron entrenadores
            </ThemedText>
          </View>
        )}

        {loading && <Spinner />}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
    flexWrap: "wrap",
  },
  input: {
    flexGrow: 1,
    minWidth: 200,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    backgroundColor: "transparent",
  },

  trainersGrid: {
    paddingHorizontal: 16,
    gap: 20,
    flexDirection: "column",
  },

  trainerCard: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    elevation: 4,
  },

  trainerImageContainer: {
    width: "50%",
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

  trainerInfo: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  trainerInfoTop: {
    marginBottom: 10,
    gap: 10,
  },
  profileButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "center",
  },

  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
});
