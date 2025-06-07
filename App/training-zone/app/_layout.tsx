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

import { Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loaded] = useFonts({
    Montserrat_700Bold,
    Roboto_400Regular,
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
