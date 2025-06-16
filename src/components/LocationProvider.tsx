import { createContext, useContext, useEffect, useState } from 'react';
import { LocationPermissionModal } from './modals/LocationPermissionModal';
import { VPNDetectedModal } from './modals/VPNDetectedModal';
import { useLocation } from '../hooks/useLocation';
import { LocationData } from '../services/locationService';

interface LocationContextType {
  location: LocationData | null;
  isLocationLoading: boolean;
  requestLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const { location, isLoading, error, isVPNDetected, requestLocation, clearError } = useLocation();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showVPNModal, setShowVPNModal] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Show permission modal on first visit if no location is available
    if (!hasInitialized && !location) {
      setShowPermissionModal(true);
      setHasInitialized(true);
    }
  }, [hasInitialized, location]);

  useEffect(() => {
    if (isVPNDetected) {
      setShowPermissionModal(false);
      setShowVPNModal(true);
    }
  }, [isVPNDetected]);

  const handleLocationGranted = () => {
    setShowPermissionModal(false);
    clearError();
  };

  const handleLocationDenied = async () => {
    setShowPermissionModal(false);
    // Try to get IP-based location as fallback
    try {
      await requestLocation();
    } catch (err) {
      console.warn('Failed to get IP location:', err);
    }
  };

  const handleVPNDetected = () => {
    setShowPermissionModal(false);
    setShowVPNModal(true);
  };

  const handleVPNModalClose = () => {
    setShowVPNModal(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isLocationLoading: isLoading,
        requestLocation,
      }}
    >
      {children}
      
      <LocationPermissionModal
        isOpen={showPermissionModal}
        onLocationGranted={handleLocationGranted}
        onLocationDenied={handleLocationDenied}
        onVPNDetected={handleVPNDetected}
      />
      
      <VPNDetectedModal
        isOpen={showVPNModal}
        onClose={handleVPNModalClose}
      />
    </LocationContext.Provider>
  );
};