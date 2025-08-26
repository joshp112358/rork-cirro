import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Effect, EFFECTS } from '@/types/entry';

interface EffectSelectorProps {
  effects: Effect[];
  onChange: (effects: Effect[]) => void;
}

export function EffectSelector({ effects, onChange }: EffectSelectorProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const toggleEffect = (name: string) => {
    const existing = effects.find(e => e.name === name);
    if (existing) {
      onChange(effects.filter(e => e.name !== name));
    } else {
      onChange([...effects, { name, intensity: 3 }]);
    }
  };

  const updateIntensity = (name: string, intensity: number) => {
    onChange(effects.map(e => 
      e.name === name ? { ...e, intensity } : e
    ));
  };

  const isSelected = (name: string) => effects.some(e => e.name === name);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Effects</Text>
        <Text style={styles.selectedCount}>{effects.length} selected</Text>
      </View>
      <View style={styles.effectsGrid}>
        {EFFECTS.map(effect => (
          <TouchableOpacity
            key={effect}
            style={[
              styles.effectChip,
              isSelected(effect) && styles.effectChipSelected
            ]}
            onPress={() => toggleEffect(effect)}
            testID={`effect-${effect}`}
          >
            <Text style={[
              styles.effectText,
              isSelected(effect) && styles.effectTextSelected
            ]}>
              {effect}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {effects.length > 0 && (
        <View style={styles.selectedEffects}>
          <Text style={styles.selectedTitle}>Intensity</Text>
          {effects.map(effect => (
            <View key={effect.name} style={styles.intensityRow}>
              <Text style={styles.effectName}>{effect.name}</Text>
              <View style={styles.intensityContainer}>
                <Text style={styles.intensityValue}>{effect.intensity}/5</Text>
                <View style={styles.intensityButtons}>
                  {[1, 2, 3, 4, 5].map(level => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.intensityButton,
                        effect.intensity >= level && styles.intensityButtonActive
                      ]}
                      onPress={() => updateIntensity(effect.name, level)}
                    >
                      <View style={[
                        styles.intensityDot,
                        effect.intensity >= level && styles.intensityDotActive
                      ]} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
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
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  selectedCount: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  effectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  effectChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  effectChipSelected: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  effectText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  effectTextSelected: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.regular,
  },
  selectedEffects: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  selectedTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  intensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  effectName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    flex: 1,
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  intensityValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    minWidth: 30,
  },
  intensityButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  intensityButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityButtonActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  intensityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
  },
  intensityDotActive: {
    backgroundColor: theme.colors.background,
  },
});