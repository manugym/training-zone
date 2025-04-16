import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
  Animated,
  Dimensions,
  TextStyle,
} from "react-native";
import { useRef, useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Login from "@/components/AuthForms/Login";
import Register from "@/components/AuthForms/Register";
import { Colors } from "@/constants/Colors";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function AuthScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [formType, setFormType] = useState<"login" | "register">("login");
  const position = useRef(new Animated.Value(0)).current;

  const slideTo = (type: "login" | "register") => {
    const toValue = type === "login" ? 0 : -SCREEN_WIDTH;

    Animated.timing(position, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setFormType(type);
    });
  };

  const getTitleStyle = (type: "login" | "register") => {
    const isActive = formType === type;
    return {
      color: isActive ? theme.primary : theme.text + "99",
      borderBottomWidth: isActive ? 2 : 0,
      borderBottomColor: isActive ? theme.primary : "transparent",
      fontWeight: isActive
        ? ("bold" as TextStyle["fontWeight"])
        : ("normal" as TextStyle["fontWeight"]),
      paddingBottom: 8,
      marginHorizontal: 20,
      fontSize: 20,
    };
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.switchContainer}>
        <TouchableOpacity onPress={() => slideTo("login")}>
          <ThemedText type="subtitle" style={getTitleStyle("login")}>
            Login
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => slideTo("register")}>
          <ThemedText type="subtitle" style={getTitleStyle("register")}>
            Register
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.formWrapper}>
        <Animated.View
          style={[
            styles.sliderContainer,
            { transform: [{ translateX: position }] },
          ]}
        >
          <View style={styles.page}>
            <Login />
          </View>
          <View style={styles.page}>
            <Register />
          </View>
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  formWrapper: {
    width: SCREEN_WIDTH,
    overflow: "hidden",
    flex: 1,
    paddingTop: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  sliderContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 2,
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
