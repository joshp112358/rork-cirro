import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import { Plus, TrendingUp, Calendar, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useEntries, useRecentEntries } from '@/hooks/use-entries';
import { EntryCard } from '@/components/EntryCard';






export default function HomeScreen() {
  const { theme } = useTheme();
  const { analytics } = useEntries();
  const recentEntries = useRecentEntries(3);


  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });







  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.appName}>Cirro</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Settings size={20} color={theme.colors.textSecondary} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
          <Text style={styles.date}>{today}</Text>
        </View>

        <TouchableOpacity 
          style={styles.newEntryButton}
          onPress={() => router.push('/new-entry')}
          testID="new-entry-button"
        >
          <View style={styles.newEntryContent}>
            <View style={styles.plusIcon}>
              <Plus size={24} color={theme.colors.background} strokeWidth={1.5} />
            </View>
            <View style={styles.newEntryText}>
              <Text style={styles.newEntryTitle}>Log Session</Text>
              <Text style={styles.newEntrySubtitle}>Track your experience</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.budtenderButton}
          onPress={() => router.push('/(tabs)/budtender')}
          testID="budtender-button"
        >
          <View style={styles.newEntryContent}>
            <View style={styles.botIcon}>
              <Text style={styles.botEmoji}>🤖</Text>
            </View>
            <View style={styles.newEntryText}>
              <Text style={styles.newEntryTitle}>AI Budtender</Text>
              <Text style={styles.newEntrySubtitle}>Get personalized recommendations</Text>
            </View>
          </View>
        </TouchableOpacity>

        {analytics && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{analytics.totalSessions}</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{analytics.preferredStrainPercentage}%</Text>
              <Text style={styles.statLabel}>{analytics.preferredStrainType}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{analytics.avgRating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        )}

        {recentEntries.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            {recentEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </View>
        )}




      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  appName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.heavy,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newEntryButton: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
  },
  budtenderButton: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
  },
  botIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botEmoji: {
    fontSize: 20,
  },
  newEntryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  plusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newEntryText: {
    flex: 1,
  },
  newEntryTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  newEntrySubtitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  seeAll: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  dealsSection: {
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.cardSecondary,
    borderRadius: theme.borderRadius.round,
    borderWidth: 0.5,
    borderColor: theme.colors.primary,
  },
  locationButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  locationText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  dealsScroll: {
    paddingLeft: theme.spacing.xl,
  },
  dealsContent: {
    paddingRight: theme.spacing.xl,
  },
  dealCard: {
    width: 280,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  dealImageContainer: {
    position: 'relative',
  },
  dealImage: {
    width: '100%',
    height: 140,
    backgroundColor: theme.colors.cardSecondary,
  },
  discountBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: '#EF4444',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  discountText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.heavy,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dealContent: {
    padding: theme.spacing.md,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  strainTypeBadge: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  strainTypeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dealStrainName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  dealDispensary: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  dealPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  originalPrice: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.heavy,
    color: theme.colors.primary,
  },
  dealMeta: {
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  ratingText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  reviewCount: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flex: 1,
  },
  validUntil: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: '#EF4444',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});