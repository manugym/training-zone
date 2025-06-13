import { ScrollView, StyleSheet, View, Image } from "react-native";
import {
  TextInput,
  Button,
  Menu,
  Card,
  Text,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ServerUrl } from "@/constants/ServerUrl";
import { AllTrainers } from "@/models/all-trainers";
import { ClassType } from "@/models/enums/class-type";
import { TrainerFilter } from "@/models/trainer-filter";
import trainerService from "@/services/trainer.service";
import { Shapes } from "@/constants/Shapes";

export default function AllTrainersPage() {
  const theme = useTheme();
  const router = useRouter();

  const SERVER_IMAGE_URL = `${ServerUrl}/UserProfilePicture`;

  const [allTrainers, setAllTrainers] = useState<AllTrainers | null>(null);

  const [classType, setClassType] = useState<ClassType | null>(null);
  const [name, setName] = useState("");

  // Initial filter
  const [filter, setFilter] = useState<TrainerFilter>({
    ClassType: null,
    Name: "",
  });

  const [loading, setLoading] = useState(false);

  // For Menu dropdown
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

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
        setAllTrainers(allTrainers);
      } catch (error) {
        console.error("Error fetching trainers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, [filter]);

  // Dropdown options for class types
  const classTypeOptions = [
    { label: "Todas las clases", value: null },
    ...Object.keys(ClassType)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: ClassType[key as keyof typeof ClassType],
      })),
  ];

  // Get label for current classType value
  const currentClassLabel =
    classTypeOptions.find((opt) => opt.value === classType)?.label ||
    "Selecciona clase";

  return (
    <View
      style={[
        styles.viewContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Stack.Screen options={{ title: "All Trainers" }} />

      {/*Searcher */}
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          label="Buscar entrenador..."
          value={name}
          onChangeText={setName}
          theme={{
            colors: {
              primary: theme.colors.surface,
            },
          }}
        />

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Button
              mode="outlined"
              onPress={openMenu}
              style={styles.menuButton}
              textColor={theme.colors.onBackground}
              icon="menu-down"
            >
              {currentClassLabel}
            </Button>
          }
        >
          {classTypeOptions.map(({ label, value }) => (
            <Menu.Item
              key={label}
              onPress={() => {
                setClassType(value);
                closeMenu();
              }}
              title={label}
              titleStyle={{
                color:
                  classType === value
                    ? theme.colors.primary
                    : theme.colors.onSurface,
                fontWeight: classType === value ? "700" : "400",
              }}
            />
          ))}
        </Menu>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {allTrainers && allTrainers.Trainers.length > 0 ? (
          <View style={styles.trainersGrid}>
            {allTrainers.Trainers.map((trainer) => (
              <Card
                key={trainer.User.Id}
                style={[
                  styles.trainerCard,
                  {
                    borderColor: theme.colors.secondary,
                    backgroundColor: "transparent",
                  },
                ]}
                mode="outlined"
              >
                <View style={styles.trainerRow}>
                  <Image
                    source={{
                      uri: `${SERVER_IMAGE_URL}/${
                        trainer.User.AvatarImageUrl ||
                        "UserProfilePicture/default.png"
                      }`,
                    }}
                    style={styles.trainerImage}
                    resizeMode="cover"
                  />

                  <View style={styles.trainerInfo}>
                    <Text
                      variant="headlineMedium"
                      style={{
                        color: theme.colors.onSurface,
                        textAlign: "left",
                      }}
                    >
                      {trainer.User.Name}
                    </Text>

                    <View style={styles.classTypesContainer}>
                      {trainer.TrainerClasses.map((c, i) => (
                        <Text
                          key={c.Id}
                          style={{
                            color:
                              i % 2 === 0
                                ? theme.colors.secondary
                                : theme.colors.primary,
                            fontWeight: "600",
                            marginRight: 8,
                          }}
                          variant="bodyMedium"
                        >
                          {ClassType[c.Type]}
                        </Text>
                      ))}
                    </View>

                    <Button
                      mode="contained"
                      onPress={() =>
                        router.push({
                          pathname: "/Trainer",
                          params: { id: trainer.User.Id },
                        })
                      }
                      style={styles.profileButton}
                      contentStyle={{ paddingVertical: 4 }}
                      labelStyle={{ fontSize: 14, fontWeight: "700" }}
                    >
                      Ver Perfil
                    </Button>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : !loading ? (
          <View style={styles.noResultsContainer}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface }}
            >
              No se encontraron entrenadores
            </Text>
          </View>
        ) : (
          <ActivityIndicator
            animating={true}
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 20 }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  textInput: {
    width: "100%",
  },
  menuButton: {
    width: "100%",
    justifyContent: "center",
  },

  trainersGrid: {
    paddingHorizontal: 16,
    gap: 20,
    flexDirection: "column",
  },
  trainerCard: {
    borderRadius: Shapes.small,
    overflow: "hidden",
    borderWidth: 2,
    marginBottom: 16,
  },
  trainerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  trainerImage: {
    width: "50%",
    margin: 16,
    aspectRatio: 1,
    borderRadius: Shapes.small,
  },
  trainerInfo: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: "flex-start",
    gap: 16,
  },
  classTypesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  profileButton: {
    alignSelf: "flex-start",
  },
  noResultsContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
});
