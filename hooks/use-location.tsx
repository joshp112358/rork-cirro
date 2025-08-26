import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  hasPermission: boolean;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const checkPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (err) {
      console.error('Error checking location permission:', err);
      setError('Failed to check location permission');
      return false;
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      
      if (granted) {
        await getCurrentLocation();
      } else {
        setError('Location permission denied');
      }
      
      return granted;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError('Failed to request location permission');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      // Use web geolocation API
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        return;
      }

      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationData: LocationData = { latitude, longitude };
          
          try {
            // Try to get address using reverse geocoding
            const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (address) {
              locationData.address = `${address.city}, ${address.region}`;
            }
          } catch (err) {
            console.log('Could not get address:', err);
          }
          
          setLocation(locationData);
          setIsLoading(false);
        },
        (err) => {
          console.error('Web geolocation error:', err);
          setError('Failed to get location');
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      // Use expo-location for mobile
      try {
        setIsLoading(true);
        const locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 100,
        });
        
        const { latitude, longitude } = locationResult.coords;
        const locationData: LocationData = { latitude, longitude };
        
        try {
          // Try to get address using reverse geocoding
          const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (address) {
            locationData.address = `${address.city}, ${address.region}`;
          }
        } catch (err) {
          console.log('Could not get address:', err);
        }
        
        setLocation(locationData);
        setError(null);
      } catch (err) {
        console.error('Error getting location:', err);
        setError('Failed to get current location');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    if (hasPermission && !location) {
      getCurrentLocation();
    }
  }, [hasPermission]);

  return {
    location,
    isLoading,
    error,
    requestPermission,
    hasPermission,
  };
}