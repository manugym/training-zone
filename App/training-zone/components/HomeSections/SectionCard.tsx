import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import HomeCard from "@/components/HomeSections/HomeCard"
import { MaterialCommunityIcons, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function SectionCards() {
  const router = useRouter();

  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 32,
      paddingHorizontal: 12,
      backgroundColor: theme.background,
    },
    offerContainer: {
      maxWidth: 1200,
      alignSelf: "center",
    },
    offerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: theme.text,
    },
    offerDescription: {
      color: theme.text,
      textAlign: "center",
      marginBottom: 40,
      fontSize: 16,
      lineHeight: 24,
    },
    cardsGrid: {
      gap: 20,
      flexDirection: "column"
    },
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.offerContainer}>
        <Text style={styles.offerTitle}>¿Qué servicios ofrecemos?</Text>
        <Text style={styles.offerDescription}>
          Nos comprometemos a ofrecer el mejor servicio deportivo a nuestros clientes.{"\n"}
          Nuestros servicios van desde el entrenamiento personalizado a los entrenamientos
          grupales donde nuestros clientes pueden alcanzar sus objetivos de la forma que más
          se amolde a sus necesidades.
        </Text>
        <View style={styles.cardsGrid}>
          <HomeCard
            icon={<MaterialCommunityIcons name="karate" size={48} color="#2d6cdf" />}
            title="Entrenamiento Personal"
            descriptionText="Logra tus objetivos de manera eficiente gracias a tu entrenador y clases personalizadas"
            buttonText="Conocer más"
            onPress={() => router.push("/Auth")}
          />
          <HomeCard
            icon={<FontAwesome6 name="users" size={48} color="#2d6cdf" />}
            title="Entrenamiento en Grupo"
            descriptionText="El entrenamiento en grupo permite mejorar tu físico de una manera divertida"
            buttonText="Ver descripción"
            onPress={() => router.push("/Auth")}
          />
          <HomeCard
            icon={<Ionicons name="phone-portrait-outline" size={48} color="#2d6cdf" />}
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
