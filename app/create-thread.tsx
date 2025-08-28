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
} from 'react-native';
import {
  X,
  MapPin,
  Send,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useLocation } from '@/hooks/use-location';
import { router } from 'expo-router';
import { useUser } from '@/hooks/use-user';
import { useThreads } from '@/hooks/use-threads';

interface ThreadData {
  title: string;
  content: string;
  dispensary: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}



export default function CreateThreadScreen() {
  const { theme } = useTheme();
  const { location, isLoading: locationLoading, requestPermission, hasPermission } = useLocation();
  const { profile } = useUser();
  const { addThread } = useThreads();
  const [threadData, setThreadData] = useState<ThreadData>({
    title: '',
    content: '',
    dispensary: '',
  });
  const [includeLocation, setIncludeLocation] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
        dispensary: threadData.dispensary.trim(),
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

          {/* Dispensary Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Dispensary</Text>
            <TextInput
              style={[
                styles.titleInput,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholder="Which dispensary are you talking about? (optional)"
              placeholderTextColor={theme.colors.textTertiary}
              value={threadData.dispensary}
              onChangeText={(text) => setThreadData(prev => ({ ...prev, dispensary: text }))}
              maxLength={100}
            />
            <Text style={[styles.charCount, { color: theme.colors.textTertiary }]}>
              {threadData.dispensary.length}/100
            </Text>
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
            
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>Share your location to help others find local discussions</Text>
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
});