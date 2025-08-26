import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, Award, Zap, AlertCircle } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useEntries } from '@/hooks/use-entries';

export default function AnalyticsScreen() {
  const { analytics, entries } = useEntries();

  if (!analytics || entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📊</Text>
        <Text style={styles.emptyTitle}>No data yet</Text>
        <Text style={styles.emptyText}>
          Track at least one session to see your analytics
        </Text>
      </View>
    );
  }

  const topStrainsList = Object.entries(analytics.topStrains)
    .map(([name, data]) => ({
      name,
      count: data.count,
      avgRating: data.totalRating / data.count
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

  const positiveEffects = Object.entries(analytics.topEffects)
    .filter(([name]) => !['Dry Mouth', 'Dry Eyes', 'Anxious', 'Paranoid', 'Dizzy', 'Headache', 'Tired'].includes(name))
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  const negativeEffects = Object.entries(analytics.topEffects)
    .filter(([name]) => ['Dry Mouth', 'Dry Eyes', 'Anxious', 'Paranoid', 'Dizzy', 'Headache', 'Tired'].includes(name))
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.overviewSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{analytics.totalSessions}</Text>
            <Text style={styles.overviewLabel}>Total Sessions</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{analytics.avgRating.toFixed(1)}</Text>
            <Text style={styles.overviewLabel}>Avg Rating</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={[
              styles.overviewValue,
              { color: analytics.avgMoodImprovement > 0 ? theme.colors.success : theme.colors.error }
            ]}>
              {analytics.avgMoodImprovement > 0 ? '+' : ''}{analytics.avgMoodImprovement.toFixed(1)}
            </Text>
            <Text style={styles.overviewLabel}>Avg Mood Change</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Award size={20} color={theme.colors.accent} />
          <Text style={styles.sectionTitle}>Top Strains</Text>
        </View>
        {topStrainsList.map((strain, index) => (
          <View key={strain.name} style={styles.listItem}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemName}>{strain.name}</Text>
              <Text style={styles.listItemSubtext}>
                {strain.count} {strain.count === 1 ? 'session' : 'sessions'}
              </Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {strain.avgRating.toFixed(1)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Consumption Methods</Text>
        </View>
        {Object.entries(analytics.methodCounts).map(([method, count]) => (
          <View key={method} style={styles.methodBar}>
            <Text style={styles.methodName}>{method}</Text>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar,
                  { 
                    width: `${(count / analytics.totalSessions) * 100}%`,
                    backgroundColor: theme.colors.primary
                  }
                ]}
              />
            </View>
            <Text style={styles.methodCount}>{count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Zap size={20} color={theme.colors.positiveEffect} />
          <Text style={styles.sectionTitle}>Common Positive Effects</Text>
        </View>
        {positiveEffects.map(([effect, data]) => (
          <View key={effect} style={styles.effectItem}>
            <Text style={styles.effectName}>{effect}</Text>
            <View style={styles.effectStats}>
              <Text style={styles.effectCount}>{data.count}x</Text>
              <View style={styles.intensityDots}>
                {[1, 2, 3, 4, 5].map(i => (
                  <View
                    key={i}
                    style={[
                      styles.intensityDot,
                      i <= data.avgIntensity && { backgroundColor: theme.colors.positiveEffect }
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      {negativeEffects.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={20} color={theme.colors.negativeEffect} />
            <Text style={styles.sectionTitle}>Common Side Effects</Text>
          </View>
          {negativeEffects.map(([effect, data]) => (
            <View key={effect} style={styles.effectItem}>
              <Text style={styles.effectName}>{effect}</Text>
              <View style={styles.effectStats}>
                <Text style={styles.effectCount}>{data.count}x</Text>
                <View style={styles.intensityDots}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <View
                      key={i}
                      style={[
                        styles.intensityDot,
                        i <= data.avgIntensity && { backgroundColor: theme.colors.negativeEffect }
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Strain Types</Text>
        </View>
        <View style={styles.typeGrid}>
          {Object.entries(analytics.strainCounts).map(([type, count]) => (
            <View key={type} style={styles.typeCard}>
              <Text style={styles.typeEmoji}>
                {type === 'Indica' ? '😴' : type === 'Sativa' ? '⚡' : type === 'Hybrid' ? '🌿' : '💚'}
              </Text>
              <Text style={styles.typeName}>{type}</Text>
              <Text style={styles.typeCount}>{count}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  overviewSection: {
    padding: theme.spacing.lg,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadow,
  },
  overviewValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  overviewLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadow,
  },
  rank: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  listItemContent: {
    flex: 1,
  },
  listItemName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
  listItemSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  ratingBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  ratingText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600' as const,
  },
  methodBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  methodName: {
    width: 80,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  barContainer: {
    flex: 1,
    height: 24,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.sm,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  methodCount: {
    width: 30,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'right' as const,
  },
  effectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  effectName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  effectStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  effectCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  intensityDots: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadow,
  },
  typeEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  typeName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  typeCount: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
});