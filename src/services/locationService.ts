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
  // Additional fields that might indicate VPN/proxy
  proxy?: boolean;
  hosting?: boolean;
  mobile?: boolean;
  threat?: string;
}

class LocationService {
  private static instance: LocationService;
  private currentLocation: LocationData | null = null;
  private locationPermissionStatus: PermissionState | null = null;
  private readonly LOCATION_STORAGE_KEY = 'fanect_location_data';
  private readonly PERMISSION_STORAGE_KEY = 'fanect_location_permission';

  private constructor() {
    // Load cached data on initialization
    this.loadCachedData();
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Load cached location and permission data
  private loadCachedData(): void {
    try {
      const cachedLocation = localStorage.getItem(this.LOCATION_STORAGE_KEY);
      const cachedPermission = localStorage.getItem(this.PERMISSION_STORAGE_KEY);
      
      if (cachedLocation) {
        this.currentLocation = JSON.parse(cachedLocation);
      }
      
      if (cachedPermission) {
        this.locationPermissionStatus = cachedPermission as PermissionState;
      }
    } catch (error) {
      console.warn('Failed to load cached location data:', error);
    }
  }

  // Save location data to localStorage
  private saveLocationData(location: LocationData): void {
    try {
      localStorage.setItem(this.LOCATION_STORAGE_KEY, JSON.stringify(location));
    } catch (error) {
      console.warn('Failed to save location data:', error);
    }
  }

  // Save permission status to localStorage
  private savePermissionStatus(status: PermissionState): void {
    try {
      localStorage.setItem(this.PERMISSION_STORAGE_KEY, status);
    } catch (error) {
      console.warn('Failed to save permission status:', error);
    }
  }

  // Enhanced VPN detection with multiple methods
  private async detectVPN(ipData: IPLocationResponse): Promise<boolean> {
    console.log('Checking for VPN/Proxy with data:', ipData);

    // Method 1: Check explicit proxy/hosting flags if available
    if (ipData.proxy === true || ipData.hosting === true) {
      console.log('VPN detected: Explicit proxy/hosting flag');
      return true;
    }

    // Method 2: Check threat indicators
    if (ipData.threat && ['proxy', 'vpn', 'tor'].some(threat => 
      (ipData.threat as string).toLowerCase().includes(threat)
    )) {
      console.log('VPN detected: Threat indicator');
      return true;
    }

    // Method 3: Enhanced organization name checking
    const vpnIndicators = [
      // VPN services
      /vpn/i,
      /proxy/i,
      /tunnel/i,
      /anonymizer/i,
      /private.*internet.*access/i,
      /nordvpn/i,
      /expressvpn/i,
      /surfshark/i,
      /cyberghost/i,
      /protonvpn/i,
      /mullvad/i,
      /windscribe/i,
      
      // Hosting/Cloud providers (commonly used by VPNs)
      /hosting/i,
      /datacenter/i,
      /data.*center/i,
      /cloud/i,
      /server/i,
      /digital.*ocean/i,
      /amazon.*web.*services/i,
      /amazon.*technologies/i,
      /google.*cloud/i,
      /microsoft.*corporation/i,
      /linode/i,
      /vultr/i,
      /ovh/i,
      /hetzner/i,
      /scaleway/i,
      /rackspace/i,
      /godaddy/i,
      /namecheap/i,
      
      // Tor and anonymity networks
      /tor/i,
      /onion/i,
      /anonymous/i,
      
      // Common VPN/proxy keywords
      /residential.*proxy/i,
      /mobile.*proxy/i,
      /dedicated.*server/i,
      /virtual.*private/i,
    ];

    // Check organization name for VPN indicators
    const orgName = ipData.org || '';
    const orgIndicatesVPN = vpnIndicators.some(pattern => pattern.test(orgName));
    
    if (orgIndicatesVPN) {
      console.log('VPN detected: Organization name indicates VPN/proxy:', orgName);
      return true;
    }

    // Method 4: Check ASN (Autonomous System Number) for known VPN providers
    const knownVPNASNs = [
      'AS13335', // Cloudflare (often used by VPNs)
      'AS14061', // DigitalOcean
      'AS16509', // Amazon
      'AS15169', // Google
      'AS8075',  // Microsoft
      'AS63949', // Linode
      'AS20473', // Choopa (Vultr)
      'AS16276', // OVH
      'AS24940', // Hetzner
    ];

    if (ipData.asn && knownVPNASNs.includes(ipData.asn)) {
      console.log('VPN detected: Known VPN/hosting ASN:', ipData.asn);
      return true;
    }

    // Method 5: Additional API check for more accurate VPN detection
    try {
      const vpnCheckResult = await this.checkVPNWithSecondaryAPI(ipData);
      if (vpnCheckResult) {
        console.log('VPN detected: Secondary API confirmation');
        return true;
      }
    } catch (error) {
      console.warn('Secondary VPN check failed:', error);
    }

    console.log('No VPN detected');
    return false;
  }

  // Secondary VPN detection using a different API
  private async checkVPNWithSecondaryAPI(ipData: IPLocationResponse): Promise<boolean> {
    try {
      // Using a different IP info service for cross-validation
      const response = await fetch('https://ipinfo.io/json');
      
      if (!response.ok) {
        throw new Error('Secondary API unavailable');
      }

      const secondaryData = await response.json();
      
      // Check if the organization from both APIs indicates hosting/VPN
      const hostingKeywords = ['hosting', 'datacenter', 'cloud', 'server', 'vpn', 'proxy'];
      const secondaryOrgIndicatesHosting = hostingKeywords.some(keyword => 
        (secondaryData.org || '').toLowerCase().includes(keyword)
      );

      // If both APIs indicate hosting/VPN, it's likely a VPN
      const primaryOrgIndicatesHosting = hostingKeywords.some(keyword => 
        (ipData.org || '').toLowerCase().includes(keyword)
      );

      return primaryOrgIndicatesHosting && secondaryOrgIndicatesHosting;
    } catch (error) {
      // If secondary check fails, don't block the user
      return false;
    }
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
              this.savePermissionStatus('denied');
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

  // Enhanced IP location detection with better VPN checking
  private async getIPLocation(): Promise<LocationData> {
    const apis = [
      {
        url: 'https://ipapi.co/json/',
        parser: (data: any): IPLocationResponse => ({
          country: data.country_code,
          country_code: data.country_code,
          city: data.city,
          region: data.region,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          org: data.org,
          asn: data.asn,
        })
      },
      {
        url: 'http://ip-api.com/json/',
        parser: (data: any): IPLocationResponse => ({
          country: data.countryCode,
          country_code: data.countryCode,
          city: data.city,
          region: data.regionName,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
          org: data.isp,
          asn: data.as,
          proxy: data.proxy,
          hosting: data.hosting,
          mobile: data.mobile,
        })
      }
    ];

    let lastError: Error | null = null;

    for (const api of apis) {
      try {
        console.log(`Trying IP location API: ${api.url}`);
        const response = await fetch(api.url);
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const rawData = await response.json();
        const data = api.parser(rawData);

        console.log('IP location data received:', data);

        // Check for VPN with enhanced detection
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

        console.log('Location data processed:', locationData);
        return locationData;
      } catch (error) {
        console.warn(`API ${api.url} failed:`, error);
        lastError = error as Error;
        
        if (error instanceof Error && error.message === 'VPN_DETECTED') {
          throw error;
        }
        
        // Continue to next API
        continue;
      }
    }

    // If all APIs failed
    throw lastError || new Error('Failed to get IP-based location');
  }

  // Check location permission status
  public async checkLocationPermission(): Promise<PermissionState> {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        this.locationPermissionStatus = permission.state;
        this.savePermissionStatus(permission.state);
        return permission.state;
      }
      return this.locationPermissionStatus || 'prompt';
    } catch (error) {
      console.warn('Permission API not supported');
      return this.locationPermissionStatus || 'prompt';
    }
  }

  // Request location permission
  public async requestLocationPermission(): Promise<boolean> {
    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
        });
      });
      
      this.locationPermissionStatus = 'granted';
      this.savePermissionStatus('granted');
      return true;
    } catch (error) {
      this.locationPermissionStatus = 'denied';
      this.savePermissionStatus('denied');
      return false;
    }
  }

  // Check if user has already granted permission
  public hasLocationPermission(): boolean {
    return this.locationPermissionStatus === 'granted';
  }

  // Check if user has denied permission
  public hasLocationPermissionDenied(): boolean {
    return this.locationPermissionStatus === 'denied';
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
          this.saveLocationData(gpsLocation);
          this.savePermissionStatus('granted');
          return gpsLocation;
        } catch (gpsError) {
          console.warn('GPS location failed, falling back to IP location:', gpsError);
        }
      }

      // Fallback to IP-based location
      const ipLocation = await this.getIPLocation();
      this.currentLocation = ipLocation;
      this.saveLocationData(ipLocation);
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

  // Clear cached location and permission data
  public clearLocation(): void {
    this.currentLocation = null;
    this.locationPermissionStatus = null;
    localStorage.removeItem(this.LOCATION_STORAGE_KEY);
    localStorage.removeItem(this.PERMISSION_STORAGE_KEY);
  }

  // Method to test VPN detection (for debugging)
  public async testVPNDetection(): Promise<void> {
    try {
      console.log('Testing VPN detection...');
      const location = await this.getIPLocation();
      console.log('VPN test completed. Location obtained:', location);
    } catch (error) {
      console.log('VPN test result:', error);
    }
  }
}

export const locationService = LocationService.getInstance();
export type { LocationData };