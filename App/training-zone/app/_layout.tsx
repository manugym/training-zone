import React, { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loaded] = useFonts({
    BebasNeue_400Regular,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = isDark ? CustomPaperDarkTheme : CustomPaperLightTheme;

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
        <StatusBar style={isDark ? "light" : "dark"} />
      </PaperProvider>
      <Toast />
    </>
  );
}
