import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Login from "@/components/AuthForms/Login";
import Register from "@/components/AuthForms/Register";
import { Colors } from "@/constants/Colors";

export default function AuthScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [formType, setFormType] = useState<"login" | "register">("login");

  const getTitleStyle = (type: "login" | "register") => {
    const isActive = formType === type;
    return {
      color: isActive ? theme.primary : theme.text + "99",
      borderBottomWidth: isActive ? 2 : 0,
      borderBottomColor: isActive ? theme.primary : "transparent",
      fontWeight: isActive ? ("bold" as const) : ("normal" as const),
      paddingBottom: 8,
      marginHorizontal: 20,
      fontSize: 20,
    };
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.switchContainer}>
        <TouchableOpacity onPress={() => setFormType("login")}>
          <ThemedText type="subtitle" style={getTitleStyle("login")}>
            Login
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFormType("register")}>
          <ThemedText type="subtitle" style={getTitleStyle("register")}>
            Register
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        {formType === "login" ? <Login /> : <Register />}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
