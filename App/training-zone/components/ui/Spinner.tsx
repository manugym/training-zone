import { Colors } from "@/constants/Colors";
import Spinner from "react-native-loading-spinner-overlay";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";

export default function SpinnerComponent() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <Spinner
      visible={true}
      overlayColor={theme.background}
      customIndicator={
        <View style={styles.container}>
          <ActivityIndicator size={120} color={theme.details} />
          <Text style={[styles.text, { color: theme.details }]}>
            Loading...
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: "500",
  },
});
