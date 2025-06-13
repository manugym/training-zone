import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import HomeCard from "@/components/HomeSections/HomeCard";
import { MaterialCommunityIcons, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

export default function SectionCards() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.offerContainer}>
        <Text style={[styles.offerTitle, { color: theme.colors.onBackground }]}>
          ¿Qué servicios ofrecemos?
        </Text>
        <Text style={[styles.offerDescription, { color: theme.colors.onBackground }]}>
          Nos comprometemos a ofrecer el mejor servicio deportivo a nuestros clientes.{"\n"}
          Nuestros servicios van desde el entrenamiento personalizado a los entrenamientos
          grupales donde nuestros clientes pueden alcanzar sus objetivos de la forma que más
          se amolde a sus necesidades.
        </Text>
        <View style={styles.cardsGrid}>
          <HomeCard
            icon={<MaterialCommunityIcons name="karate" size={48} color={theme.colors.primary} />}
            title="Entrenamiento Personal"
            descriptionText="Logra tus objetivos de manera eficiente gracias a tu entrenador y clases personalizadas"
            buttonText="Conocer más"
            onPress={() => router.push("/Auth")}
          />
          <HomeCard
            icon={<FontAwesome6 name="users" size={48} color={theme.colors.primary} />}
            title="Entrenamiento en Grupo"
            descriptionText="El entrenamiento en grupo permite mejorar tu físico de una manera divertida"
            buttonText="Ver descripción"
            onPress={() => router.push("/Auth")}
          />
          <HomeCard
            icon={<Ionicons name="phone-portrait-outline" size={48} color={theme.colors.primary} />}
            title="Plan de entrenamiento"
            descriptionText="Consigue un plan de entrenamiento personalizado gracias a nuestra IA"
            buttonText="Conocer más"
            onPress={() => router.push("/Auth")}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 10,
  },
  offerContainer: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  offerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  offerDescription: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },
  cardsGrid: {
    gap: 20,
    flexDirection: "column",
  },
});
