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
              value >= mood && styles.moodButtonActive
            ]}
            onPress={() => onChange(mood)}
            testID={`mood-${mood}`}
          >
            <View style={[
              styles.moodLine,
              value >= mood && styles.moodLineActive
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
    gap: 2,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: 4,
  },
  moodButton: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    backgroundColor: 'transparent',
  },
  moodButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  moodLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  moodLineActive: {
    backgroundColor: '#FFFFFF',
  },
  moodLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});