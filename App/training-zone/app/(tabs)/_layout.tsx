import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  CustomPaperLightTheme,
  CustomPaperDarkTheme,
} from "@/constants/ReactNativePaperTheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const themeColors = isDark
    ? CustomPaperDarkTheme.colors
    : CustomPaperLightTheme.colors;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.onSurfaceVariant,
        tabBarInactiveTintColor: themeColors.onSurface,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: themeColors.surfaceVariant,
            borderTopColor: "transparent",
          },
          default: {
            backgroundColor: themeColors.surfaceVariant,
            borderTopColor: "transparent",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="AllTrainers"
        options={{
          title: "Entrenadores",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="run" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="AllClasses"
        options={{
          title: "Clases",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="dumbbell" size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="RoutineGenerator"
        options={{
          title: "Rutina",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="robot" size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="AllConversations"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat" size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="UserProfile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
