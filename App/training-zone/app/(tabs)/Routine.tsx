// screens/GenerateRoutineScreen.tsx
import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RoutinePreferences } from '@/models/routine-preferences';
import routineService from '@/services/routine.service';
import { UserLanguage } from '@/models/enums/user-language';
import { UserGender } from '@/models/enums/user-gender';
import { UserGoal } from '@/models/enums/user-goal';
import { UserLevel } from '@/models/enums/user-level';
import { UserPreferredActivities } from '@/models/enums/user-preferred-activities';

export default function GenerateRoutineScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prefs: RoutinePreferences = {
        language: UserLanguage.English,
        age: 20,
        gender: UserGender.Female,
        heightCm: 175,
        weightKg: 70,
        goal: UserGoal.BuildMuscle,
        level: UserLevel.Advanced,
        daysPerWeek: 4,
        timeToTrainMinutes: 45,
        preferredActivities: UserPreferredActivities.Calisthenics,
      };

      const uri = await routineService.getRoutine(prefs);
      navigation.navigate('RoutinePdfViewer', { uri });
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo generar la rutina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading
        ? <ActivityIndicator size="large" />
        : <Button title="Generar rutina PDF" onPress={handleGenerate} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
});
