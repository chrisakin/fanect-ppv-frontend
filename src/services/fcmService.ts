import { getFCMToken, requestNotificationPermission, onMessageListener } from '../lib/firebase';
import axios from '../lib/axios';

export class FCMService {
  private static instance: FCMService;
  private fcmToken: string | null = null;

  private constructor() {}

  public static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  public async initializeFCM(): Promise<void> {
    try {
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
        }
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
        
        // You can also dispatch a custom event or update a store here
        window.dispatchEvent(new CustomEvent('fcm-message', { detail: payload }));
      })
      .catch((err) => console.log('Failed to receive message:', err));
  }

  public getFCMToken(): string | null {
    return this.fcmToken;
  }
}

export const fcmService = FCMService.getInstance();