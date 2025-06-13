import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  descriptionText: string;
  buttonText: string;
  onPress?: () => void;
}

const HomeCard: React.FC<CardProps> = ({
  icon,
  title,
  descriptionText,
  buttonText,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
      <View style={styles.icon}>{icon}</View>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.colors.onSurface }]}>{descriptionText}</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 5,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    width: "98%",
    alignSelf: "center",
    minHeight: 150,
  },
  icon: {
    marginBottom: 14,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    marginBottom: 14,
    textAlign: "center",
  },
  button: {
    borderRadius: 99,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomeCard;
