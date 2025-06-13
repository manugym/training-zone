import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import HomeCard from "@/components/HomeSections/HomeCard";
import { MaterialCommunityIcons, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { useTranslation } from 'react-i18next';

export default function SectionCards() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation('home');

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.offerContainer}>
        <Text style={[styles.offerTitle, { color: theme.colors.onBackground }]}>
          {t('sectionCards.title')}
        </Text>
        <Text style={[styles.offerDescription, { color: theme.colors.onBackground }]}>
          {t('sectionCards.description')}
        </Text>
        <View style={styles.cardsGrid}>
          <HomeCard
            icon={<MaterialCommunityIcons name="karate" size={48} color={theme.colors.primary} />}
            title={t('sectionCards.personalTrainingTitle')}
            descriptionText={t('sectionCards.personalTrainingDescription')}
            buttonText={t('sectionCards.knowMore')}
            onPress={() => router.push("/Auth")}
          />
          <HomeCard
            icon={<FontAwesome6 name="users" size={48} color={theme.colors.primary} />}
            title={t('sectionCards.groupTrainingTitle')}
            descriptionText={t('sectionCards.groupTrainingDescription')}
            buttonText={t('sectionCards.seeDescription')}
            onPress={() => router.push("/Auth")}
          />
          <HomeCard
            icon={<Ionicons name="phone-portrait-outline" size={48} color={theme.colors.primary} />}
            title={t('sectionCards.aiPlanTitle')}
            descriptionText={t('sectionCards.aiPlanDescription')}
            buttonText={t('sectionCards.knowMore')}
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
