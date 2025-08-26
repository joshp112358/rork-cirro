import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MOOD_LABELS } from '@/types/entry';

interface MoodSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Overall Mood</Text>
        <Text style={styles.value}>{value}/5</Text>
      </View>
      <View style={styles.moodContainer}>
        {[1, 2, 3, 4, 5].map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodButton,
              value >= mood && { 
                backgroundColor: theme.colors.text,
              }
            ]}
            onPress={() => onChange(mood)}
            testID={`mood-${mood}`}
          >
            <View style={[
              styles.moodDot,
              value >= mood && styles.moodDotActive
            ]} />
          </TouchableOpacity>
        ))}
      </View>
      {value > 0 && (
        <Text style={styles.moodLabel}>
          {MOOD_LABELS[value as keyof typeof MOOD_LABELS]}
        </Text>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  moodContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  moodButton: {
    flex: 1,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  moodDotActive: {
    backgroundColor: theme.colors.background,
  },
  moodLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});