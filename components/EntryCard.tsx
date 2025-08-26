import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { JournalEntry } from '@/types/entry';
import { router } from 'expo-router';

interface EntryCardProps {
  entry: JournalEntry;
  onPress?: () => void;
}

export function EntryCard({ entry, onPress }: EntryCardProps) {
  const { theme } = useTheme();
  
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getMoodColor = (mood: number) => {
    const colors = [
      theme.colors.error,
      theme.colors.warning,
      theme.colors.textSecondary,
      theme.colors.secondary,
      theme.colors.success,
    ];
    return colors[mood - 1] || theme.colors.border;
  };

  const moodValue = entry.mood.overall;

  const getAmountUnit = (method: string) => {
    switch (method) {
      case 'Flower': return 'g';
      case 'Vape': return 'puffs';
      case 'Edible': return 'mg';
      default: return '';
    }
  };



  const styles = createStyles(theme);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress || (() => router.push(`/entry/${entry.id}`))}
      testID="entry-card"
    >
      <View style={styles.header}>
        <View style={styles.strainInfo}>
          <Text style={styles.strainName}>{entry.strain.name || 'Unknown Strain'}</Text>
          {entry.strain.type && (
            <View style={styles.strainTypeBadge}>
              <Text style={styles.strainType}>{entry.strain.type}</Text>
            </View>
          )}
        </View>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{entry.rating.toFixed(1)}</Text>
          <Star size={12} color={theme.colors.accent} fill={theme.colors.accent} strokeWidth={1.5} />
        </View>
      </View>

      <View style={styles.moodSection}>
        <View style={styles.moodIndicators}>
          <Text style={styles.moodLabel}>Mood</Text>
          <View style={styles.moodItem}>
            <View style={[styles.moodDot, { backgroundColor: getMoodColor(moodValue) }]} />
            <Text style={styles.moodValue}>{moodValue}/5</Text>
          </View>
        </View>
        {entry.effects.length > 0 && (
          <View style={styles.effectsPreview}>
            <Text style={styles.effectsCount}>{entry.effects.length} effects</Text>
          </View>
        )}
      </View>

      {entry.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {entry.notes}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(entry.timestamp)}</Text>
        <View style={styles.methodAmount}>
          <Text style={styles.amount}>{entry.amount || 0}{getAmountUnit(entry.method)}</Text>
          <Text style={styles.method}>{entry.method}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  strainInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  strainName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  strainTypeBadge: {
    backgroundColor: theme.colors.cardSecondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs,
  },
  strainType: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  ratingText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  moodSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  moodIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  moodLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moodItem: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  moodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  moodValue: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  effectsPreview: {
    backgroundColor: theme.colors.cardSecondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
  },
  effectsCount: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  notes: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.normal * theme.fontSize.sm,
    marginBottom: theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  methodAmount: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  method: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});