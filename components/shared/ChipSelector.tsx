import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface ChipSelectorProps {
  options: string[];
  selected: string | string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  horizontal?: boolean;
  style?: any;
}

export function ChipSelector({ 
  options, 
  selected, 
  onSelect, 
  multiSelect = false, 
  horizontal = false,
  style 
}: ChipSelectorProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isSelected = (option: string) => {
    if (Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected === option;
  };

  const renderChips = () => (
    <View style={horizontal ? styles.horizontalContainer : styles.gridContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.chip,
            isSelected(option) && styles.chipActive,
            horizontal && styles.horizontalChip
          ]}
          onPress={() => onSelect(option)}
        >
          <Text style={[
            styles.chipText,
            isSelected(option) && styles.chipTextActive
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (horizontal) {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, style]}
      >
        {renderChips()}
      </ScrollView>
    );
  }

  return (
    <View style={style}>
      {renderChips()}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  horizontalContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  scrollContainer: {
    paddingRight: theme.spacing.xl,
  },
  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalChip: {
    minWidth: 80,
  },
  chipActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  chipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.regular,
  },
});