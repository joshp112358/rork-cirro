import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import {
  X,
  MapPin,
  Hash,
  Send,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { useLocation } from '@/hooks/use-location';
import { router } from 'expo-router';
import { useUser } from '@/hooks/use-user';
import { useThreads } from '@/hooks/use-threads';

interface ThreadData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  images: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

const categories = [
  'General',
  'Medical',
  'Strains',
  'Edibles',
  'Growing',
  'Dispensaries',
  'Reviews',
  'News',
  'Legal',
  'Lifestyle'
];

const popularTags = [
  'beginner',
  'advice',
  'review',
  'medical',
  'recreational',
  'cbd',
  'thc',
  'indica',
  'sativa',
  'hybrid',
  'edibles',
  'vape',
  'flower',
  'concentrate',
  'growing',
  'dispensary',
  'local',
  'deals',
  'news',
  'legal'
];

export default function CreateThreadScreen() {
  const { theme } = useTheme();
  const { location, isLoading: locationLoading, requestPermission, hasPermission } = useLocation();
  const { profile } = useUser();
  const { addThread } = useThreads();
  const [threadData, setThreadData] = useState<ThreadData>({
    title: '',
    content: '',
    category: 'General',
    tags: [],
    images: [],
  });
  const [includeLocation, setIncludeLocation] = useState<boolean>(false);
  const [customTag, setCustomTag] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { width: screenWidth } = Dimensions.get('window');
  const imageSize = (screenWidth - 60) / 3; // 3 images per row with padding

  const handleLocationToggle = async () => {
    if (!includeLocation) {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (granted && location) {
          setIncludeLocation(true);
          setThreadData(prev => ({
            ...prev,
            location: {
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address,
            }
          }));
        }
      } else if (location) {
        setIncludeLocation(true);
        setThreadData(prev => ({
          ...prev,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address,
          }
        }));
      }
    } else {
      setIncludeLocation(false);
      setThreadData(prev => {
        const { location, ...rest } = prev;
        return rest;
      });
    }
  };

  const addTag = (tag: string) => {
    if (!threadData.tags.includes(tag) && threadData.tags.length < 10) {
      setThreadData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setThreadData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addCustomTag = () => {
    const tag = customTag.trim().toLowerCase();
    if (tag && !threadData.tags.includes(tag) && threadData.tags.length < 10) {
      addTag(tag);
      setCustomTag('');
    }
  };

  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photo library.');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your camera.');
      return false;
    }
    return true;
  };

  const pickImages = async () => {
    console.log('Requesting media library permissions...');
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) {
      console.log('Media library permission denied');
      return;
    }

    console.log('Launching image library...');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10 - threadData.images.length, // Limit selection based on remaining slots
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        const totalImages = threadData.images.length + newImages.length;
        
        if (totalImages > 10) {
          Alert.alert('Too many images', 'You can only add up to 10 images per thread.');
          return;
        }
        
        console.log('Adding images:', newImages);
        setThreadData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const takePhoto = async () => {
    console.log('Requesting camera permissions...');
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }

    if (threadData.images.length >= 10) {
      Alert.alert('Too many images', 'You can only add up to 10 images per thread.');
      return;
    }

    console.log('Launching camera...');
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Adding photo from camera:', result.assets[0].uri);
        setThreadData(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri]
        }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setThreadData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const showImageOptions = () => {
    if (threadData.images.length >= 10) {
      Alert.alert('Maximum images reached', 'You can only add up to 10 images per thread.');
      return;
    }

    Alert.alert(
      'Add Images',
      'Choose how you want to add images to your thread',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImages },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!threadData.title.trim() || !threadData.content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create the new thread using the context
      await addThread({
        title: threadData.title.trim(),
        content: threadData.content.trim(),
        author: profile?.name || 'Anonymous',
        category: threadData.category,
        tags: threadData.tags,
        images: threadData.images,
        ...(threadData.location && { location: threadData.location })
      });
      
      console.log('Thread created successfully!');
      
      // Navigate back immediately
      router.back();
      
      // Show success message after navigation
      setTimeout(() => {
        Alert.alert('Success!', 'Your thread has been created successfully.');
      }, 100);
      
    } catch (error) {
      console.error('Error creating thread:', error);
      Alert.alert('Error', 'Failed to create thread. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Create Thread</Text>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              { 
                backgroundColor: threadData.title.trim() && threadData.content.trim() 
                  ? theme.colors.primary 
                  : theme.colors.textTertiary + '30'
              }
            ]}
            onPress={handleSubmit}
            disabled={!threadData.title.trim() || !threadData.content.trim() || isSubmitting}
          >
            <Send 
              size={18} 
              color={threadData.title.trim() && threadData.content.trim() 
                ? theme.colors.background 
                : theme.colors.textTertiary
              } 
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Title</Text>
            <TextInput
              style={[
                styles.titleInput,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholder="What's your thread about?"
              placeholderTextColor={theme.colors.textTertiary}
              value={threadData.title}
              onChangeText={(text) => setThreadData(prev => ({ ...prev, title: text }))}
              maxLength={200}
              multiline
            />
            <Text style={[styles.charCount, { color: theme.colors.textTertiary }]}>
              {threadData.title.length}/200
            </Text>
          </View>

          {/* Content Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Content</Text>
            <TextInput
              style={[
                styles.contentInput,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              placeholderTextColor={theme.colors.textTertiary}
              value={threadData.content}
              onChangeText={(text) => setThreadData(prev => ({ ...prev, content: text }))}
              maxLength={5000}
              multiline
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, { color: theme.colors.textTertiary }]}>
              {threadData.content.length}/5000
            </Text>
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: threadData.category === category 
                        ? theme.colors.primary 
                        : theme.colors.card,
                      borderColor: threadData.category === category 
                        ? theme.colors.primary 
                        : theme.colors.border,
                    }
                  ]}
                  onPress={() => setThreadData(prev => ({ ...prev, category }))}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: threadData.category === category 
                          ? theme.colors.background 
                          : theme.colors.text,
                      }
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Images Section */}
          <View style={styles.section}>
            <View style={styles.imagesHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Images</Text>
              <TouchableOpacity
                style={[
                  styles.addImageButton,
                  {
                    backgroundColor: theme.colors.primary + '15',
                    borderColor: theme.colors.primary,
                  }
                ]}
                onPress={showImageOptions}
                disabled={threadData.images.length >= 10}
              >
                <Plus size={16} color={theme.colors.primary} />
                <Text style={[styles.addImageText, { color: theme.colors.primary }]}>
                  Add Images
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>
              Add up to 10 images to your thread
            </Text>
            
            {threadData.images.length > 0 && (
              <View style={styles.imagesGrid}>
                {threadData.images.map((imageUri, index) => (
                  <View key={index} style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.threadImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={[styles.removeImageButton, { backgroundColor: theme.colors.error }]}
                      onPress={() => removeImage(index)}
                    >
                      <Trash2 size={12} color={theme.colors.background} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            
            {threadData.images.length >= 10 && (
              <Text style={[styles.imageLimit, { color: theme.colors.warning }]}>
                Maximum 10 images allowed
              </Text>
            )}
          </View>

          {/* Tags Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tags</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>Help others find your thread</Text>
            
            {/* Selected Tags */}
            {threadData.tags.length > 0 && (
              <View style={styles.selectedTags}>
                {threadData.tags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.selectedTag, { backgroundColor: theme.colors.primary + '15' }]}
                    onPress={() => removeTag(tag)}
                  >
                    <Hash size={12} color={theme.colors.primary} />
                    <Text style={[styles.selectedTagText, { color: theme.colors.primary }]}>
                      {tag}
                    </Text>
                    <Minus size={12} color={theme.colors.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Custom Tag Input */}
            <View style={styles.customTagContainer}>
              <TextInput
                style={[
                  styles.customTagInput,
                  {
                    color: theme.colors.text,
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  }
                ]}
                placeholder="Add custom tag..."
                placeholderTextColor={theme.colors.textTertiary}
                value={customTag}
                onChangeText={setCustomTag}
                onSubmitEditing={addCustomTag}
                maxLength={20}
              />
              <TouchableOpacity
                style={[
                  styles.addTagButton,
                  { backgroundColor: customTag.trim() ? theme.colors.primary : theme.colors.textTertiary + '30' }
                ]}
                onPress={addCustomTag}
                disabled={!customTag.trim()}
              >
                <Plus 
                  size={16} 
                  color={customTag.trim() ? theme.colors.background : theme.colors.textTertiary} 
                />
              </TouchableOpacity>
            </View>

            {/* Tags */}
            <Text style={[styles.popularTagsTitle, { color: theme.colors.textSecondary }]}>Tags:</Text>
            <View style={styles.popularTags}>
              {popularTags.filter(tag => !threadData.tags.includes(tag)).slice(0, 15).map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.popularTag,
                    {
                      backgroundColor: theme.colors.backgroundSecondary,
                      borderColor: theme.colors.border,
                    }
                  ]}
                  onPress={() => addTag(tag)}
                  disabled={threadData.tags.length >= 10}
                >
                  <Hash size={10} color={theme.colors.textTertiary} />
                  <Text style={[styles.popularTagText, { color: theme.colors.textSecondary }]}>
                    {tag}
                  </Text>
                  <Plus size={10} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
            
            {threadData.tags.length >= 10 && (
              <Text style={[styles.tagLimit, { color: theme.colors.warning }]}>Maximum 10 tags allowed</Text>
            )}
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <View style={styles.locationHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Location</Text>
              <TouchableOpacity
                style={[
                  styles.locationToggle,
                  {
                    backgroundColor: includeLocation ? theme.colors.primary + '15' : theme.colors.backgroundSecondary,
                    borderColor: includeLocation ? theme.colors.primary : theme.colors.border,
                  }
                ]}
                onPress={handleLocationToggle}
                disabled={locationLoading}
              >
                <MapPin 
                  size={16} 
                  color={includeLocation ? theme.colors.primary : theme.colors.textTertiary} 
                />
                <Text
                  style={[
                    styles.locationToggleText,
                    {
                      color: includeLocation ? theme.colors.primary : theme.colors.textTertiary,
                    }
                  ]}
                >
                  {locationLoading ? 'Getting location...' : includeLocation ? 'Location included' : 'Add location'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {includeLocation && threadData.location && (
              <View style={[styles.locationInfo, { backgroundColor: theme.colors.card }]}>
                <MapPin size={16} color={theme.colors.primary} />
                <View style={styles.locationDetails}>
                  <Text style={[styles.locationAddress, { color: theme.colors.text }]}>
                    {threadData.location.address || 'Current location'}
                  </Text>
                  <Text style={[styles.locationCoords, { color: theme.colors.textTertiary }]}>
                    {threadData.location.latitude.toFixed(4)}, {threadData.location.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            )}
            
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>Help others find local discussions</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  submitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
    minHeight: 50,
    maxHeight: 100,
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 120,
    maxHeight: 200,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  categoriesContainer: {
    paddingRight: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  selectedTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  customTagContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  customTagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  addTagButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularTagsTitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  popularTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    gap: 3,
  },
  popularTagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  tagLimit: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  locationToggleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
  },
  locationDetails: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationCoords: {
    fontSize: 12,
    marginTop: 2,
  },
  imagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  addImageText: {
    fontSize: 13,
    fontWeight: '500',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  threadImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLimit: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});