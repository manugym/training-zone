import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TextStyle,
} from "react-native";
import { useRef, useState } from "react";
import { Text, Surface, useTheme, TouchableRipple } from "react-native-paper";

import Login from "@/components/AuthForms/Login";
import Register from "@/components/AuthForms/Register";
import { useTranslation } from "react-i18next";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function AuthScreen() {
  const { t } = useTranslation("auth");

  const theme = useTheme();
  const [formType, setFormType] = useState<"login" | "register">("login");
  const position = useRef(new Animated.Value(0)).current;

  const slideTo = (type: "login" | "register") => {
    const toValue = type === "login" ? 0 : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setFormType(type);
    });
  };

  const getTitleStyle = (type: "login" | "register") => {
    const isActive = formType === type;
    return {
      color: isActive ? theme.colors.primary : theme.colors.onBackground + "99",
      borderBottomWidth: isActive ? 2 : 0,
      borderBottomColor: isActive ? theme.colors.primary : "transparent",
      fontWeight: isActive
        ? ("bold" as TextStyle["fontWeight"])
        : ("normal" as TextStyle["fontWeight"]),
      paddingBottom: 8,
      marginHorizontal: 20,
      fontSize: 20,
    };
  };

  return (
    <Surface
      style={[{ backgroundColor: theme.colors.background }, styles.container]}
      elevation={2}
    >
      <View style={styles.switchContainer}>
        <TouchableRipple onPress={() => slideTo("login")} borderless>
          <Text style={getTitleStyle("login")}>{t("login")}</Text>
        </TouchableRipple>

        <TouchableRipple onPress={() => slideTo("register")} borderless>
          <Text style={getTitleStyle("register")}>{t("register")}</Text>
        </TouchableRipple>
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
    </Surface>
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
