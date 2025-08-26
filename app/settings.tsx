import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, TextInput } from 'react-native';
import { ArrowLeft, User, Lock, Trash2, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useEntries } from '@/hooks/use-entries';
import { router, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { entries } = useEntries();
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your entries and cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Success', 'All data has been cleared');
          }
        }
      ]
    );
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    
    Alert.alert('Success', 'Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordSection(false);
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <User size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
              <Text style={styles.settingLabel}>Username</Text>
            </View>
            <Text style={styles.settingValue}>Cannabis Enthusiast</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowPasswordSection(!showPasswordSection)}
          >
            <View style={styles.settingLeft}>
              <Lock size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
              <Text style={styles.settingLabel}>Change Password</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          {showPasswordSection && (
            <View style={styles.passwordSection}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor={theme.colors.textTertiary}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeButton}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={16} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={16} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor={theme.colors.textTertiary}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeButton}
                  >
                    {showNewPassword ? (
                      <EyeOff size={16} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={16} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor={theme.colors.textTertiary}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={16} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.updateButton}
                onPress={handlePasswordUpdate}
              >
                <Text style={styles.updateButtonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleClearData}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={18} color={theme.colors.error} strokeWidth={1.5} />
              <Text style={[styles.settingLabel, { color: theme.colors.error }]}>
                Clear All Data
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.dataInfo}>
            <Text style={styles.dataInfoText}>
              You currently have {entries.length} sessions logged. Clearing data will permanently remove all entries.
            </Text>
          </View>
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
    marginBottom: theme.spacing.xl,
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
  passwordSection: {
    backgroundColor: theme.colors.cardSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  passwordInput: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  eyeButton: {
    padding: theme.spacing.md,
  },
  updateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  updateButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.background,
  },
  dataInfo: {
    backgroundColor: theme.colors.cardSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  dataInfoText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});