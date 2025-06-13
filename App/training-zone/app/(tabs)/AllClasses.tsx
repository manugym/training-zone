import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import classService from "@/services/class.service";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ClassType } from "@/models/enums/class-type";
import { Class } from "@/models/class";
import { ServerUrl } from "@/constants/ServerUrl";
import { Shapes } from "@/constants/Shapes";
import { useTheme } from "react-native-paper";

const SERVER_IMAGE_URL = `${ServerUrl || ""}/ClassPicture`;

export default function AllClassesScreen() {
  const [classes, setClasses] = useState<Class[] | null>(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const fetchedClasses = await classService.getAllClasses();
        setClasses(fetchedClasses);
      } catch (e) {
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.colors.background }}
      >
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          Nuestras Clases
        </Text>

        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 48 }}
          />
        )}

        {!loading && (!classes || classes.length === 0) && (
          <View style={styles.noClasses}>
            <Text style={{ fontSize: 20, color: theme.colors.onBackground }}>
              No se encontraron clases
            </Text>
          </View>
        )}

        {!loading && classes && (
          <View style={styles.classesContainer}>
            {classes.map((activity) => (
              <TouchableOpacity
                key={activity.Id}
                style={[
                  styles.classCard,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.primary,
                  },
                ]}
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: "/ClassDetail",
                    params: { id: activity.Id },
                  })
                }
              >
                <Image
                  source={{
                    uri: `${SERVER_IMAGE_URL}/${activity.ClassImageUrl}`,
                  }}
                  style={styles.classImage}
                  resizeMode="cover"
                />
                <View style={styles.infoContainer}>
                  <Text
                    style={[styles.classType, { color: theme.colors.primary }]}
                  >
                    {ClassType[activity.Type]}
                  </Text>
                  <Text
                    style={[
                      styles.classDescription,
                      { color: theme.colors.onBackground },
                    ]}
                  >
                    {activity.Description}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: theme.colors.primary },
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: "/ClassDetail",
                        params: { id: activity.Id },
                      })
                    }
                  >
                    <Text style={styles.buttonText}>Ver Clase</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    minHeight: "100%",
  },
  content: {
    paddingHorizontal: 16,
    alignItems: "center",
    width: "100%",
    paddingBottom: 32,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  classesContainer: {
    width: "100%",
    gap: 24,
    paddingBottom: 40,
  },
  classCard: {
    borderRadius: Shapes.small,
    overflow: "hidden",
    marginBottom: 18,
    width: "100%",
    alignSelf: "center",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  classImage: {
    width: "100%",
    height: screenWidth > 450 ? 180 : 140,
    borderTopLeftRadius: Shapes.small,
    borderTopRightRadius: Shapes.small,
  },
  infoContainer: {
    padding: 16,
    gap: 8,
  },
  classType: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 3,
  },
  classDescription: {
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 99,
    alignItems: "center",
    marginTop: 6,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  noClasses: {
    marginTop: 36,
    alignItems: "center",
  },
});
