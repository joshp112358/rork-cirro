import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import { Plus, TrendingUp, Calendar, Settings, MapPin, Star, Tag, ShoppingBag, Navigation } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useEntries, useRecentEntries } from '@/hooks/use-entries';
import { EntryCard } from '@/components/EntryCard';
import { useLocation } from '@/hooks/use-location';

interface Deal {
  id: string;
  dispensary: string;
  strainName: string;
  strainType: 'Indica' | 'Sativa' | 'Hybrid' | 'CBD';
  originalPrice: number;
  salePrice: number;
  discount: number;
  image: string;
  description: string;
  location: string;
  distance: number;
  rating: number;
  reviewCount: number;
  validUntil: string;
  category: 'Flower' | 'Edibles' | 'Concentrates' | 'Vapes' | 'Accessories';
}

const mockDeals: Deal[] = [
  {
    id: '1',
    dispensary: 'Green Valley Dispensary',
    strainName: 'Blue Dream',
    strainType: 'Hybrid',
    originalPrice: 45,
    salePrice: 32,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    description: 'Premium indoor grown Blue Dream with exceptional terpene profile',
    location: 'Downtown',
    distance: 2.3,
    rating: 4.8,
    reviewCount: 127,
    validUntil: 'Today only',
    category: 'Flower',
  },
  {
    id: '2',
    dispensary: 'Sunset Cannabis Co.',
    strainName: 'Gorilla Glue #4',
    strainType: 'Indica',
    originalPrice: 55,
    salePrice: 38,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
    description: 'Heavy hitting indica perfect for evening relaxation',
    location: 'Midtown',
    distance: 1.8,
    rating: 4.6,
    reviewCount: 89,
    validUntil: 'Ends tomorrow',
    category: 'Flower',
  },
  {
    id: '3',
    dispensary: 'Elevated Wellness',
    strainName: 'Sour Diesel Gummies',
    strainType: 'Sativa',
    originalPrice: 25,
    salePrice: 18,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop',
    description: '10mg THC gummies with natural fruit flavors',
    location: 'Westside',
    distance: 3.1,
    rating: 4.7,
    reviewCount: 203,
    validUntil: '3 days left',
    category: 'Edibles',
  },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const { analytics } = useEntries();
  const recentEntries = useRecentEntries(3);
  const { location, isLoading: locationLoading, hasPermission, requestPermission } = useLocation();
  const [deals] = useState<Deal[]>(mockDeals);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleLocationRequest = async () => {
    try {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Location Permission Required',
          'To show nearby dispensary deals, please enable location access in your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location:', error);
      Alert.alert('Error', 'Failed to access location. Please try again.');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Flower':
        return '#10B981';
      case 'Edibles':
        return '#F59E0B';
      case 'Concentrates':
        return '#8B5CF6';
      case 'Vapes':
        return '#06B6D4';
      case 'Accessories':
        return '#EF4444';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStrainTypeColor = (type: string) => {
    switch (type) {
      case 'Indica':
        return '#8B5CF6';
      case 'Sativa':
        return '#10B981';
      case 'Hybrid':
        return '#F59E0B';
      case 'CBD':
        return '#06B6D4';
      default:
        return theme.colors.textSecondary;
    }
  };

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

        <View style={styles.dealsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <ShoppingBag size={20} color={theme.colors.text} strokeWidth={1.5} />
              <Text style={styles.sectionTitle}>Today's Best Deals</Text>
            </View>
            {!hasPermission && (
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={handleLocationRequest}
                disabled={locationLoading}
              >
                <Navigation size={16} color={theme.colors.primary} strokeWidth={1.5} />
                <Text style={styles.locationButtonText}>
                  {locationLoading ? 'Finding...' : 'Near Me'}
                </Text>
              </TouchableOpacity>
            )}
            {hasPermission && location && (
              <View style={styles.locationInfo}>
                <MapPin size={14} color={theme.colors.textSecondary} strokeWidth={1.5} />
                <Text style={styles.locationText}>
                  {location.address || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
                </Text>
              </View>
            )}
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.dealsScroll}
            contentContainerStyle={styles.dealsContent}
          >
            {deals.map((deal) => (
              <TouchableOpacity key={deal.id} style={styles.dealCard}>
                <View style={styles.dealImageContainer}>
                  <Image source={{ uri: deal.image }} style={styles.dealImage} />
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{deal.discount}% OFF</Text>
                  </View>
                </View>
                <View style={styles.dealContent}>
                  <View style={styles.dealHeader}>
                    <View style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(deal.category) }
                    ]}>
                      <Text style={styles.categoryText}>{deal.category}</Text>
                    </View>
                    <View style={[
                      styles.strainTypeBadge,
                      { backgroundColor: getStrainTypeColor(deal.strainType) }
                    ]}>
                      <Text style={styles.strainTypeText}>{deal.strainType}</Text>
                    </View>
                  </View>
                  <Text style={styles.dealStrainName} numberOfLines={1}>
                    {deal.strainName}
                  </Text>
                  <Text style={styles.dealDispensary} numberOfLines={1}>
                    {deal.dispensary}
                  </Text>
                  <View style={styles.dealPricing}>
                    <Text style={styles.originalPrice}>${deal.originalPrice}</Text>
                    <Text style={styles.salePrice}>${deal.salePrice}</Text>
                  </View>
                  <View style={styles.dealMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={1} />
                      <Text style={styles.ratingText}>{deal.rating}</Text>
                      <Text style={styles.reviewCount}>({deal.reviewCount})</Text>
                    </View>
                  </View>
                  <View style={styles.dealFooter}>
                    <View style={styles.locationContainer}>
                      <MapPin size={12} color={theme.colors.textSecondary} strokeWidth={1.5} />
                      <Text style={styles.locationText}>{deal.location} • {deal.distance}mi</Text>
                    </View>
                    <Text style={styles.validUntil}>{deal.validUntil}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {recentEntries.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyEmoji}>🌿</Text>
            </View>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyText}>
              Start logging your cannabis experiences to track patterns and insights
            </Text>
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.sm,
    maxWidth: 280,
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