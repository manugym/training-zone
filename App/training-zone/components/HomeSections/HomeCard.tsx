import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

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
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.background,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 4,
      padding: 20,
      marginVertical: 10,
      alignItems: "center",
      width: "90%",
      alignSelf: "center",
    },
    icon: {
      marginBottom: 14,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      marginBottom: 10,
      color: theme.text,
      textAlign: "center",
    },
    description: {
      color: theme.details,
      fontSize: 15,
      marginBottom: 14,
      textAlign: "center",
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 22,
      alignItems: "center",
      marginTop: 6,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{descriptionText}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeCard;
