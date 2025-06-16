import { useState, useEffect } from 'react';
import { locationService, LocationData } from '../services/locationService';

interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  isVPNDetected: boolean;
  requestLocation: () => Promise<void>;
  clearError: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVPNDetected, setIsVPNDetected] = useState(false);

  const requestLocation = async () => {
    setIsLoading(true);
    setError(null);
    setIsVPNDetected(false);

    try {
      const locationData = await locationService.getUserLocation(true);
      setLocation(locationData);
    } catch (err: any) {
      if (err.message === 'VPN_DETECTED') {
        setIsVPNDetected(true);
        setError('VPN detected. Please disable your VPN to continue.');
      } else {
        setError(err.message || 'Failed to get location');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
    setIsVPNDetected(false);
  };

  useEffect(() => {
    // Try to get cached location on mount
    const cachedLocation = locationService.getCurrentLocation();
    if (cachedLocation) {
      setLocation(cachedLocation);
    }
  }, []);

  return {
    location,
    isLoading,
    error,
    isVPNDetected,
    requestLocation,
    clearError,
  };
};