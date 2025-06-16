import { getFCMToken, requestNotificationPermission, onMessageListener } from '../lib/firebase';
import axios from '../lib/axios';

export class FCMService {
  private static instance: FCMService;
  private fcmToken: string | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  public async initializeFCM(): Promise<void> {
    // Prevent multiple initializations
    if (this.isInitialized) {
      return;
    }

    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.warn('FCM can only be initialized in browser environment');
        return;
      }

      // Check if all required environment variables are present
      if (!import.meta.env.VITE_FIREBASE_API_KEY || 
          !import.meta.env.VITE_FIREBASE_PROJECT_ID || 
          !import.meta.env.VITE_FIREBASE_VAPID_KEY) {
        console.warn('Firebase configuration incomplete, skipping FCM initialization');
        return;
      }

      // Request notification permission
      const permissionGranted = await requestNotificationPermission();
      
      if (permissionGranted) {
        // Get FCM token
        const token = await getFCMToken();
        
        if (token) {
          this.fcmToken = token;
          // Send token to backend
          await this.sendTokenToServer(token);
          
          // Listen for foreground messages
          this.setupForegroundMessageListener();
          
          this.isInitialized = true;
          console.log('FCM initialized successfully');
        } else {
          console.warn('Failed to get FCM token');
        }
      } else {
        console.warn('Notification permission not granted');
      }
    } catch (error) {
      console.error('Error initializing FCM:', error);
    }
  }

  private async sendTokenToServer(token: string): Promise<void> {
    try {
      await axios.post('/notifications/token', { fcmToken: token });
      console.log('FCM token sent to server successfully');
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
    }
  }

  private setupForegroundMessageListener(): void {
    try {
      onMessageListener()
        .then((payload: any) => {
          console.log('Received foreground message:', payload);
          
          // Show notification
          if (Notification.permission === 'granted') {
            new Notification(payload.notification.title, {
              body: payload.notification.body,
              icon: '/icon-192x192.png',
            });
          }
          
          // Dispatch custom event
          window.dispatchEvent(new CustomEvent('fcm-message', { detail: payload }));
        })
        .catch((err) => console.log('Failed to receive message:', err));
    } catch (error) {
      console.error('Error setting up message listener:', error);
    }
  }

  public getFCMToken(): string | null {
    return this.fcmToken;
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}

export const fcmService = FCMService.getInstance();