import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Platform } from 'react-native';
import { Camera, ImageIcon, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/use-theme';

interface ImageSelectorProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  title?: string;
  subtitle?: string;
}

export function ImageSelector({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  title = "Images",
  subtitle = `Add up to ${maxImages} images`
}: ImageSelectorProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const requestMediaLibraryPermissions = async () => {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need explicit media library permissions for ImagePicker
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photo library.');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need explicit camera permissions for ImagePicker
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your camera.');
      return false;
    }
    return true;
  };

  const pickImages = async () => {
    console.log('Picking images from library...');
    
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) {
      console.log('Media library permission denied');
      return;
    }

    try {
      console.log('Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxImages - images.length,
      });

      console.log('Image library result:', result);

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        const totalImages = images.length + newImages.length;
        
        if (totalImages > maxImages) {
          Alert.alert('Too many images', `You can only add up to ${maxImages} images.`);
          return;
        }
        
        console.log('Adding images:', newImages);
        onImagesChange([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const takePhoto = async () => {
    console.log('Taking photo...');
    
    if (images.length >= maxImages) {
      Alert.alert('Too many images', `You can only add up to ${maxImages} images.`);
      return;
    }

    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }

    try {
      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Adding photo to images:', result.assets[0].uri);
        onImagesChange([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const showImageOptions = () => {
    if (images.length >= maxImages) {
      Alert.alert('Maximum images reached', `You can only add up to ${maxImages} images.`);
      return;
    }

    Alert.alert(
      'Add Images',
      'Choose how you want to add images',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImages },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: theme.colors.primary + '15',
              borderColor: theme.colors.primary,
            }
          ]}
          onPress={showImageOptions}
          disabled={images.length >= maxImages}
        >
          <Plus size={16} color={theme.colors.primary} />
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
            Add Images
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>{subtitle}</Text>
      
      {images.length === 0 ? (
        <View style={styles.emptyState}>
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
              onPress={pickImages}
            >
              <ImageIcon size={20} color={theme.colors.textSecondary} strokeWidth={1.5} />
              <Text style={styles.photoButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.imagesGrid}>
          {images.map((imageUri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <X size={12} color={theme.colors.background} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      {images.length >= maxImages && (
        <Text style={styles.limitText}>
          Maximum {maxImages} images allowed
        </Text>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    gap: theme.spacing.xs,
  },
  addButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    marginBottom: theme.spacing.md,
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
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.round,
    padding: theme.spacing.xs,
  },
  limitText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.warning,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});