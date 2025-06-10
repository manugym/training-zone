import React from "react";
import { ScrollView, StyleSheet, useColorScheme } from "react-native";
import SectionLogReg from "@/components/HomeSections/SectionLogReg";
import SectionCards from "@/components/HomeSections/SectionCard";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

export default function Home() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionLogReg />
        <SectionCards />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingBottom: 40,
    gap: 18,
  },
});
