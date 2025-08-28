import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  showCharCount?: boolean;
  maxLength?: number;
  containerStyle?: any;
}

export function FormInput({ 
  label, 
  error, 
  showCharCount, 
  maxLength, 
  containerStyle, 
  style,
  value,
  ...props 
}: FormInputProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={theme.colors.textTertiary}
        value={value}
        maxLength={maxLength}
        {...props}
      />
      <View style={styles.footer}>
        {error && <Text style={styles.error}>{error}</Text>}
        {showCharCount && maxLength && (
          <Text style={styles.charCount}>
            {(value?.length || 0)}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  error: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.error,
  },
  charCount: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textTertiary,
  },
});