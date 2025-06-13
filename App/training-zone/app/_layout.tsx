import React, { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import '@/i18n';
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  CustomPaperLightTheme,
  CustomPaperDarkTheme,
} from "@/constants/ReactNativePaperTheme";

import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<"light" | "dark" | "system">("system");

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem("routine_preferences");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (["light", "dark", "system"].includes(parsed.themePreference)) {
            setThemePreference(parsed.themePreference);
          }
        }
      } catch (error) {
        console.error("Error al cargar preferencias del tema:", error);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    };

    if (fontsLoaded) {
      loadPreferences();
    }
  }, [fontsLoaded]);

  if (!appReady) return null;
  

  const resolvedTheme =
    themePreference === "system" ? systemColorScheme : themePreference;

  const theme =
    resolvedTheme === "dark" ? CustomPaperDarkTheme : CustomPaperLightTheme;

  return (
    <>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surfaceVariant,
            },
            headerTintColor: theme.colors.onBackground,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      </PaperProvider>
      <Toast />
    </>
  );
}
