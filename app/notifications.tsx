import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { ArrowLeft, Bell, Clock, MessageSquare, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useUser } from '@/hooks/use-user';
import { router, Stack } from 'expo-router';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { profile, updateNotificationPreference } = useUser();

  const toggleNotification = (key: keyof typeof profile.preferences.notifications) => {
    updateNotificationPreference(key, !profile.preferences.notifications[key]);
  };

  const notificationItems = [
    {
      key: 'sessionReminders' as const,
      icon: Clock,
      title: 'Session Reminders',
      description: 'Get reminded to log your sessions',
      value: profile.preferences.notifications.sessionReminders
    },
    {
      key: 'weeklyInsights' as const,
      icon: TrendingUp,
      title: 'Weekly Insights',
      description: 'Receive weekly analytics and trends',
      value: profile.preferences.notifications.weeklyInsights
    },
    {
      key: 'communityUpdates' as const,
      icon: MessageSquare,
      title: 'Community Updates',
      description: 'New posts and comments from the community',
      value: profile.preferences.notifications.communityUpdates
    },
    {
      key: 'newFeatures' as const,
      icon: Bell,
      title: 'New Features',
      description: 'Updates about new app features',
      value: profile.preferences.notifications.newFeatures
    },
  ];

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Notifications',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <Text style={styles.sectionDescription}>
            Choose what notifications you&apos;d like to receive
          </Text>
          
          {notificationItems.map((item) => (
            <View key={item.key} style={styles.notificationItem}>
              <View style={styles.notificationLeft}>
                <View style={styles.iconContainer}>
                  <item.icon size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationDescription}>{item.description}</Text>
                </View>
              </View>
              <Switch
                value={item.value}
                onValueChange={() => toggleNotification(item.key)}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={item.value ? theme.colors.background : theme.colors.textTertiary}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionDescription: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.lg,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  notificationDescription: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});