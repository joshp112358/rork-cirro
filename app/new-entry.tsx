import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated
} from 'react-native';
import { Save, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/use-theme';
import { useEntries } from '@/hooks/use-entries';
import { MoodSelector } from '@/components/MoodSelector';
import { EffectSelector } from '@/components/EffectSelector';
import { StarRating } from '@/components/StarRating';
import { FormSection, FormInput, FormHeader, ChipSelector, ActionButton, ImageSelector } from '@/components/shared';
import { StrainInfo, MoodRating, Effect } from '@/types/entry';

export default function NewEntryScreen() {
  const { theme } = useTheme();
  const { addEntry, isSaving } = useEntries();
  const [imageUri, setImageUri] = useState<string>('');
  const [isSavingEntry, setIsSavingEntry] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const [strain, setStrain] = useState<StrainInfo>({
    name: '',
    type: 'Hybrid',
    thc: undefined,
    thca: undefined,
    thcv: undefined,
    cbd: undefined,
    cbda: undefined,
    cbdv: undefined,
    brand: '',
    dispensary: ''
  });
  
  // Store raw text for cannabinoid inputs to handle decimal typing
  const [thcText, setThcText] = useState('');
  const [thcaText, setThcaText] = useState('');
  const [thcvText, setThcvText] = useState('');
  const [cbdText, setCbdText] = useState('');
  const [cbdaText, setCbdaText] = useState('');
  const [cbdvText, setCbdvText] = useState('');
  
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Flower' | 'Vape' | 'Dab' | 'Edible'>('Flower');
  const [mood, setMood] = useState<MoodRating>({
    overall: 3
  });
  const [effects, setEffects] = useState<Effect[]>([]);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(3);



  const analyzePackaging = async (uri: string) => {
    setIsAnalyzingImage(true);
    
    try {
      // Convert image to base64
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.readAsDataURL(blob);
      });

      // Send to AI for analysis
      const aiResponse = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert at analyzing cannabis packaging. Extract information from cannabis product labels and packaging. Return ONLY a JSON object with the following structure: {"brand": "string or null", "strain": "string or null", "consumption": "Flower|Vape|Dab|Edible or null", "strainType": "Indica|Sativa|Hybrid|CBD or null", "thc": "number or null", "thca": "number or null", "thcv": "number or null", "cbd": "number or null", "cbda": "number or null", "cbdv": "number or null"}. Only include values that are clearly visible on the packaging. Use null for missing information.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this cannabis packaging and extract the brand name, strain name, consumption method, strain type, and cannabinoid percentages (THC, THCA, THCV, CBD, CBDA, CBDV) if visible.'
                },
                {
                  type: 'image',
                  image: base64
                }
              ]
            }
          ]
        })
      });

      if (!aiResponse.ok) {
        throw new Error('Failed to analyze image');
      }

      const aiResult = await aiResponse.json();
      console.log('AI Analysis Result:', aiResult.completion);
      
      try {
        const extractedData = JSON.parse(aiResult.completion);
        
        // Update form fields with extracted data
        if (extractedData.brand) {
          setStrain(prev => ({ ...prev, brand: extractedData.brand }));
        }
        
        if (extractedData.strain) {
          setStrain(prev => ({ ...prev, name: extractedData.strain }));
        }
        
        if (extractedData.consumption && ['Flower', 'Vape', 'Dab', 'Edible'].includes(extractedData.consumption)) {
          setMethod(extractedData.consumption);
        }
        
        if (extractedData.strainType && ['Indica', 'Sativa', 'Hybrid', 'CBD'].includes(extractedData.strainType)) {
          setStrain(prev => ({ ...prev, type: extractedData.strainType }));
        }
        
        // Update cannabinoid values and text fields
        const cannabinoidUpdates: Partial<typeof strain> = {};
        
        if (extractedData.thc !== null && extractedData.thc !== undefined) {
          cannabinoidUpdates.thc = extractedData.thc;
          setThcText(extractedData.thc.toString());
        }
        
        if (extractedData.thca !== null && extractedData.thca !== undefined) {
          cannabinoidUpdates.thca = extractedData.thca;
          setThcaText(extractedData.thca.toString());
        }
        
        if (extractedData.thcv !== null && extractedData.thcv !== undefined) {
          cannabinoidUpdates.thcv = extractedData.thcv;
          setThcvText(extractedData.thcv.toString());
        }
        
        if (extractedData.cbd !== null && extractedData.cbd !== undefined) {
          cannabinoidUpdates.cbd = extractedData.cbd;
          setCbdText(extractedData.cbd.toString());
        }
        
        if (extractedData.cbda !== null && extractedData.cbda !== undefined) {
          cannabinoidUpdates.cbda = extractedData.cbda;
          setCbdaText(extractedData.cbda.toString());
        }
        
        if (extractedData.cbdv !== null && extractedData.cbdv !== undefined) {
          cannabinoidUpdates.cbdv = extractedData.cbdv;
          setCbdvText(extractedData.cbdv.toString());
        }
        
        if (Object.keys(cannabinoidUpdates).length > 0) {
          setStrain(prev => ({ ...prev, ...cannabinoidUpdates }));
        }
        
        // Show success feedback
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        Alert.alert(
          'Analysis Complete',
          'Successfully extracted information from the packaging!',
          [{ text: 'OK' }]
        );
        
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        Alert.alert(
          'Analysis Complete',
          'Image analyzed, but some information may not have been extracted automatically. Please review and fill in any missing details.',
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert(
        'Analysis Failed',
        'Could not analyze the image. Please fill in the information manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzingImage(false);
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
          <FormHeader title="Record your experience" />

          <FormSection title="Photo">
            <View style={styles.aiIndicator}>
              <Sparkles size={14} color={theme.colors.textSecondary} strokeWidth={1.5} />
              <Text style={styles.aiText}>AI Analysis</Text>
            </View>
            <ImageSelector
              images={imageUri ? [imageUri] : []}
              onImagesChange={(images) => {
                const newUri = images[0] || '';
                setImageUri(newUri);
                if (newUri && newUri !== imageUri) {
                  analyzePackaging(newUri);
                }
              }}
              maxImages={1}
              title=""
              subtitle="Take a photo or select from gallery for AI analysis"
            />
            {isAnalyzingImage && imageUri && (
              <View style={styles.analysisOverlay}>
                <View style={styles.analysisContent}>
                  <ActivityIndicator size="large" color={theme.colors.background} />
                  <Text style={styles.analysisText}>Analyzing packaging...</Text>
                  <Sparkles size={20} color={theme.colors.background} strokeWidth={1.5} />
                </View>
              </View>
            )}
          </FormSection>

          <FormSection title="Brand Name">
            <FormInput
              value={strain.brand}
              onChangeText={(text) => setStrain({...strain, brand: text})}
              placeholder="Brand name"
            />
          </FormSection>

          <FormSection title="Strain Name">
            <FormInput
              value={strain.name}
              onChangeText={(text) => setStrain({...strain, name: text})}
              placeholder="Strain name"
            />
          </FormSection>

          <FormSection title="Consumption">
            <ChipSelector
              options={['Flower', 'Vape', 'Dab', 'Edible']}
              selected={method}
              onSelect={(value) => setMethod(value as typeof method)}
              horizontal
            />
          </FormSection>

          <FormSection title="Amount">
            <FormInput
              label={`Amount (${method === 'Flower' ? 'g' : method === 'Vape' ? 'puffs' : method === 'Dab' ? 'g' : 'mg'})`}
              value={amount}
              onChangeText={setAmount}
              placeholder={method === 'Flower' ? '0.5' : method === 'Vape' ? '10' : method === 'Dab' ? '0.1' : '5'}
              keyboardType="numeric"
            />
          </FormSection>

          <FormSection title="Strain Type">
            <ChipSelector
              options={['Indica', 'Sativa', 'Hybrid', 'CBD']}
              selected={strain.type}
              onSelect={(value) => setStrain({...strain, type: value as typeof strain.type})}
              horizontal
            />
          </FormSection>

          <FormSection title="Cannabinoids">
            <View style={styles.row}>
              <FormInput
                label="THC %"
                value={thcText}
                onChangeText={(text) => {
                  setThcText(text);
                  const parsed = text.trim() === '' ? undefined : parseFloat(text);
                  setStrain({...strain, thc: isNaN(parsed!) ? undefined : parsed});
                }}
                placeholder="22.5"
                keyboardType="numeric"
                containerStyle={styles.inputThird}
              />
              <FormInput
                label="THCA %"
                value={thcaText}
                onChangeText={(text) => {
                  setThcaText(text);
                  const parsed = text.trim() === '' ? undefined : parseFloat(text);
                  setStrain({...strain, thca: isNaN(parsed!) ? undefined : parsed});
                }}
                placeholder="20.0"
                keyboardType="numeric"
                containerStyle={styles.inputThird}
              />
              <FormInput
                label="THCV %"
                value={thcvText}
                onChangeText={(text) => {
                  setThcvText(text);
                  const parsed = text.trim() === '' ? undefined : parseFloat(text);
                  setStrain({...strain, thcv: isNaN(parsed!) ? undefined : parsed});
                }}
                placeholder="1.2"
                keyboardType="numeric"
                containerStyle={styles.inputThird}
              />
            </View>
            <View style={styles.row}>
              <FormInput
                label="CBD %"
                value={cbdText}
                onChangeText={(text) => {
                  setCbdText(text);
                  const parsed = text.trim() === '' ? undefined : parseFloat(text);
                  setStrain({...strain, cbd: isNaN(parsed!) ? undefined : parsed});
                }}
                placeholder="0.5"
                keyboardType="numeric"
                containerStyle={styles.inputThird}
              />
              <FormInput
                label="CBDA %"
                value={cbdaText}
                onChangeText={(text) => {
                  setCbdaText(text);
                  const parsed = text.trim() === '' ? undefined : parseFloat(text);
                  setStrain({...strain, cbda: isNaN(parsed!) ? undefined : parsed});
                }}
                placeholder="0.3"
                keyboardType="numeric"
                containerStyle={styles.inputThird}
              />
              <FormInput
                label="CBDV %"
                value={cbdvText}
                onChangeText={(text) => {
                  setCbdvText(text);
                  const parsed = text.trim() === '' ? undefined : parseFloat(text);
                  setStrain({...strain, cbdv: isNaN(parsed!) ? undefined : parsed});
                }}
                placeholder="0.2"
                keyboardType="numeric"
                containerStyle={styles.inputThird}
              />
            </View>
          </FormSection>

          <FormSection title="Mood">
            <MoodSelector 
              value={mood.overall}
              onChange={(value) => setMood({overall: value})}
            />
          </FormSection>

          <FormSection title="Effects">
            <EffectSelector 
              effects={effects}
              onChange={setEffects}
            />
          </FormSection>

          <FormSection title="Notes">
            <FormInput
              value={notes}
              onChangeText={setNotes}
              placeholder="How was your experience?"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </FormSection>

          <FormSection title="Overall Rating">
            <View style={styles.ratingContainer}>
              <StarRating rating={rating} onChange={setRating} />
            </View>
          </FormSection>

          <ActionButton
            title="Save Entry"
            icon={Save}
            onPress={handleSave}
            loading={isSavingEntry || isSaving}
            style={styles.saveButton}
          />
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
  inputThird: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  aiText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  analysisOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  analysisContent: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  analysisText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.background,
    textAlign: 'center',
  },
});