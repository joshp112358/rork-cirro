import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { Settings, Moon, Bell, Shield, Mail, Check, Sun, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useEntries } from '@/hooks/use-entries';
import { ColorScheme } from '@/constants/theme';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { theme, userPreference, setThemePreference } = useTheme();
  const { entries } = useEntries();
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleThemeChange = (newTheme: ColorScheme | 'system') => {
    setThemePreference(newTheme);
    setShowThemeModal(false);
  };

  const getThemeLabel = () => {
    switch (userPreference) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'System';
    }
  };

  const settingsItems = [
    { icon: Bell, label: 'Notifications', onPress: () => router.push('/notifications'), value: '' },
    { icon: Moon, label: 'Appearance', onPress: () => setShowThemeModal(true), value: getThemeLabel() },
    { icon: Shield, label: 'Settings', onPress: () => router.push('/settings'), value: '' },
    { icon: Mail, label: 'Contact Support', onPress: () => router.push('/contact'), value: '' },
  ];

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🌿</Text>
          </View>
          <Text style={styles.userName}>Cannabis Enthusiast</Text>
          <Text style={styles.userStats}>{entries.length} sessions logged</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.settingItem}
              onPress={item.onPress}
            >
              <View style={styles.settingLeft}>
                <item.icon size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <View style={styles.settingRight}>
                {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>



        <View style={styles.footer}>
          <Text style={styles.version}>Cirro v1.0.0</Text>
          <Text style={styles.footerText}>Track responsibly 🌱</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showThemeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Appearance</Text>
            
            {[
              { key: 'system', label: 'System', icon: Smartphone },
              { key: 'light', label: 'Light', icon: Sun },
              { key: 'dark', label: 'Dark', icon: Moon },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={styles.themeOption}
                onPress={() => handleThemeChange(option.key as ColorScheme | 'system')}
              >
                <View style={styles.themeOptionLeft}>
                  <option.icon size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
                  <Text style={styles.themeOptionLabel}>{option.label}</Text>
                </View>
                {userPreference === option.key && (
                  <Check size={18} color={theme.colors.primary} strokeWidth={1.5} />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.heavy,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarText: {
    fontSize: 32,
  },
  userName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userStats: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  settingItem: {
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
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  settingValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  chevron: {
    fontSize: 18,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textTertiary,
  },
  dangerItem: {
    borderColor: theme.colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  version: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  themeOptionLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  modalCloseButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.primary,
  },
});