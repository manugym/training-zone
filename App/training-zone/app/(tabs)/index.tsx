import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import SectionLogReg from "@/components/HomeSections/SectionLogReg";
import SectionCards from "@/components/HomeSections/SectionCard";
import { useTheme } from "react-native-paper";

export default function Home() {
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <SectionLogReg />
      <SectionCards />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingBottom: 40,
    gap: 18,
  },
});
