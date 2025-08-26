import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
  Animated
} from 'react-native';
import { Camera, Save, X, ImageIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/use-theme';
import { useEntries } from '@/hooks/use-entries';
import { MoodSelector } from '@/components/MoodSelector';
import { EffectSelector } from '@/components/EffectSelector';
import { StarRating } from '@/components/StarRating';
import { StrainInfo, MoodRating, Effect } from '@/types/entry';

export default function NewEntryScreen() {
  const { theme } = useTheme();
  const { addEntry, isSaving } = useEntries();
  const [imageUri, setImageUri] = useState<string>('');
  const [isSavingEntry, setIsSavingEntry] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const [strain, setStrain] = useState<StrainInfo>({
    name: '',
    type: 'Hybrid',
    thc: undefined,
    cbd: undefined,
    brand: '',
    dispensary: ''
  });
  
  // Store raw text for THC/CBD inputs to handle decimal typing
  const [thcText, setThcText] = useState('');
  const [cbdText, setCbdText] = useState('');
  
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Flower' | 'Vape' | 'Edible' | 'Tincture' | 'Topical' | 'Other'>('Flower');
  const [mood, setMood] = useState<MoodRating>({
    before: 3,
    during: 3,
    after: 3
  });
  const [effects, setEffects] = useState<Effect[]>([]);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(3);



  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow camera access to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setIsSavingEntry(true);

    console.log('Saving entry:', {
      strain,
      amount: parseFloat(amount),
      method,
      mood,
      effects,
      notes,
      rating,
      imageUri
    });

    try {
      const newEntry = addEntry({
        strain,
        amount: amount.trim() ? parseFloat(amount) : 0,
        method,
        mood,
        effects,
        notes,
        rating,
        imageUri
      });

      console.log('Entry saved with ID:', newEntry.id);

      // Beautiful exit animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Navigate back after animation completes
        router.back();
      });

      // Show success feedback immediately
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

    } catch (error) {
      console.error('Error saving entry:', error);
      setIsSavingEntry(false);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    }
  };

  const styles = createStyles(theme);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>New Entry</Text>
            <Text style={styles.subtitle}>Record your experience</Text>
          </View>

          {/* Photo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Photo</Text>
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeImage}
                  onPress={() => setImageUri('')}
                >
                  <X size={16} color={theme.colors.text} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoButtons}>
                <TouchableOpacity 
                  style={styles.photoButton}
                  onPress={takePhoto}
                >
                  <Camera size={20} color={theme.colors.textSecondary} strokeWidth={1.5} />
                  <Text style={styles.photoButtonText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.photoButton}
                  onPress={pickImage}
                >
                  <ImageIcon size={20} color={theme.colors.textSecondary} strokeWidth={1.5} />
                  <Text style={styles.photoButtonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Strain Information */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Strain</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={strain.name}
                onChangeText={(text) => setStrain({...strain, name: text})}
                placeholder="Strain name"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            <View style={styles.typeGrid}>
              {(['Indica', 'Sativa', 'Hybrid', 'CBD'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    strain.type === type && styles.typeChipActive
                  ]}
                  onPress={() => setStrain({...strain, type})}
                >
                  <Text style={[
                    styles.typeChipText,
                    strain.type === type && styles.typeChipTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Potency */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Potency</Text>
            <View style={styles.row}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>THC %</Text>
                <TextInput
                  style={styles.input}
                  value={thcText}
                  onChangeText={(text) => {
                    setThcText(text);
                    const parsed = text.trim() === '' ? undefined : parseFloat(text);
                    setStrain({...strain, thc: isNaN(parsed!) ? undefined : parsed});
                  }}
                  placeholder="22.5"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>CBD %</Text>
                <TextInput
                  style={styles.input}
                  value={cbdText}
                  onChangeText={(text) => {
                    setCbdText(text);
                    const parsed = text.trim() === '' ? undefined : parseFloat(text);
                    setStrain({...strain, cbd: isNaN(parsed!) ? undefined : parsed});
                  }}
                  placeholder="0.5"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
            </View>
          </View>

          {/* Consumption */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Consumption</Text>
            <View style={styles.methodGrid}>
              {(['Flower', 'Vape', 'Edible'] as const).map(m => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.methodChip,
                    method === m && styles.methodChipActive
                  ]}
                  onPress={() => setMethod(m)}
                >
                  <Text style={[
                    styles.methodChipText,
                    method === m && styles.methodChipTextActive
                  ]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Amount ({method === 'Flower' ? 'g' : method === 'Vape' ? 'puffs' : 'mg'})
              </Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder={method === 'Flower' ? '0.5' : method === 'Vape' ? '10' : '5'}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
          </View>

          {/* Mood Tracking */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Mood</Text>
            <MoodSelector 
              label="Before"
              value={mood.before}
              onChange={(value) => setMood({...mood, before: value})}
            />
            <MoodSelector 
              label="During"
              value={mood.during}
              onChange={(value) => setMood({...mood, during: value})}
            />
            <MoodSelector 
              label="After"
              value={mood.after}
              onChange={(value) => setMood({...mood, after: value})}
            />
          </View>

          {/* Effects */}
          <View style={styles.section}>
            <EffectSelector 
              effects={effects}
              onChange={setEffects}
            />
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="How was your experience?"
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Overall Rating</Text>
            <View style={styles.ratingContainer}>
              <StarRating rating={rating} onChange={setRating} />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[
              styles.saveButton,
              (isSavingEntry || isSaving) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={isSavingEntry || isSaving}
          >
            {(isSavingEntry || isSaving) ? (
              <>
                <ActivityIndicator size="small" color={theme.colors.background} />
                <Text style={styles.saveButtonText}>Saving...</Text>
              </>
            ) : (
              <>
                <Save size={18} color={theme.colors.background} strokeWidth={1.5} />
                <Text style={styles.saveButtonText}>Save Entry</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
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
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  typeChip: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  typeChipActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  typeChipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  typeChipTextActive: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.regular,
  },
  methodGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  methodChip: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  methodChipActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  methodChipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  methodChipTextActive: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.regular,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  photoButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.sm,
  },
  removeImage: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.round,
    padding: theme.spacing.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  ratingContainer: {
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.text,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.background,
  },
});