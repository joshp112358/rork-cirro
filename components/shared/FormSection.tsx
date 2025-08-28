import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: any;
}

export function FormSection({ title, subtitle, children, style }: FormSectionProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.section, style]}>
      <Text style={styles.sectionLabel}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  section: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  sectionLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.md,
  },
});