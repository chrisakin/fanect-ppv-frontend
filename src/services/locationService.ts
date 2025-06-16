interface LocationData {
  latitude: number;
  longitude: number;
  country: string;
  city?: string;
  region?: string;
  accuracy?: number;
  source: 'gps' | 'ip';
}

interface IPLocationResponse {
  country: string;
  country_code: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
  org: string;
  asn: string;
}

class LocationService {
  private static instance: LocationService;
  private currentLocation: LocationData | null = null;
  private locationPermissionStatus: PermissionState | null = null;

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Check if VPN is detected based on various indicators
  private async detectVPN(ipData: IPLocationResponse): Promise<boolean> {
    const vpnIndicators = [
      // Common VPN/proxy organizations
      /vpn/i,
      /proxy/i,
      /hosting/i,
      /datacenter/i,
      /cloud/i,
      /server/i,
      /digital ocean/i,
      /amazon/i,
      /google cloud/i,
      /microsoft/i,
      /linode/i,
      /vultr/i,
      /ovh/i,
      /hetzner/i,
    ];

    // Check organization name for VPN indicators
    const orgIndicatesVPN = vpnIndicators.some(pattern => 
      pattern.test(ipData.org || '')
    );

    // Additional checks can be added here:
    // - Check if ASN is known VPN provider
    // - Check if IP is in known VPN ranges
    // - Use specialized VPN detection APIs

    return orgIndicatesVPN;
  }

  // Get location using GPS
  private async getGPSLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Get country from coordinates using reverse geocoding
            const country = await this.getCountryFromCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );

            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              country,
              accuracy: position.coords.accuracy,
              source: 'gps',
            };

            resolve(locationData);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          let errorMessage = 'Failed to get GPS location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  // Get country from coordinates using reverse geocoding
  private async getCountryFromCoordinates(lat: number, lng: number): Promise<string> {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      return data.countryCode || data.countryName || 'Unknown';
    } catch (error) {
      console.warn('Reverse geocoding failed, using IP-based location');
      // Fallback to IP-based location for country
      const ipLocation = await this.getIPLocation();
      return ipLocation.country;
    }
  }

  // Get location using IP address
  private async getIPLocation(): Promise<LocationData> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) {
        throw new Error('IP location service unavailable');
      }

      const data: IPLocationResponse = await response.json();

      // Check for VPN
      const isVPN = await this.detectVPN(data);
      if (isVPN) {
        throw new Error('VPN_DETECTED');
      }

      const locationData: LocationData = {
        latitude: data.latitude,
        longitude: data.longitude,
        country: data.country_code,
        city: data.city,
        region: data.region,
        source: 'ip',
      };

      return locationData;
    } catch (error) {
      if (error instanceof Error && error.message === 'VPN_DETECTED') {
        throw error;
      }
      throw new Error('Failed to get IP-based location');
    }
  }

  // Check location permission status
  public async checkLocationPermission(): Promise<PermissionState> {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        this.locationPermissionStatus = permission.state;
        return permission.state;
      }
      return 'prompt';
    } catch (error) {
      console.warn('Permission API not supported');
      return 'prompt';
    }
  }

  // Request location permission
  public async requestLocationPermission(): Promise<boolean> {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
        });
      });
      
      this.locationPermissionStatus = 'granted';
      return true;
    } catch (error) {
      this.locationPermissionStatus = 'denied';
      return false;
    }
  }

  // Main method to get user location
  public async getUserLocation(forceRefresh = false): Promise<LocationData> {
    // Return cached location if available and not forcing refresh
    if (this.currentLocation && !forceRefresh) {
      return this.currentLocation;
    }

    try {
      // First, try to get GPS location
      const permissionStatus = await this.checkLocationPermission();
      
      if (permissionStatus === 'granted' || permissionStatus === 'prompt') {
        try {
          const gpsLocation = await this.getGPSLocation();
          this.currentLocation = gpsLocation;
          return gpsLocation;
        } catch (gpsError) {
          console.warn('GPS location failed, falling back to IP location:', gpsError);
        }
      }

      // Fallback to IP-based location
      const ipLocation = await this.getIPLocation();
      this.currentLocation = ipLocation;
      return ipLocation;

    } catch (error) {
      if (error instanceof Error && error.message === 'VPN_DETECTED') {
        throw new Error('VPN_DETECTED');
      }
      throw new Error('Unable to determine location');
    }
  }

  // Get current location data
  public getCurrentLocation(): LocationData | null {
    return this.currentLocation;
  }

  // Clear cached location
  public clearLocation(): void {
    this.currentLocation = null;
    this.locationPermissionStatus = null;
  }
}

export const locationService = LocationService.getInstance();
export type { LocationData };