import { getFCMToken, requestNotificationPermission, onMessageListener, registerServiceWorker } from '../lib/firebase';
import axios from '../lib/axios';

interface FCMNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  isRead: boolean;
}

export class FCMService {
  private static instance: FCMService;
  private fcmToken: string | null = null;
  private isInitialized: boolean = false;
  private fcmNotifications: Map<string, FCMNotification> = new Map();

  private constructor() {
    // Load FCM notifications from localStorage on initialization
    this.loadFCMNotifications();
  }

  public static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  private loadFCMNotifications(): void {
    try {
      const stored = localStorage.getItem('fcm_notifications');
      if (stored) {
        const notifications = JSON.parse(stored);
        this.fcmNotifications = new Map(notifications);
        console.log(`Loaded ${this.fcmNotifications.size} FCM notifications from storage`);
      }
    } catch (error) {
      console.error('Error loading FCM notifications:', error);
      this.fcmNotifications = new Map();
    }
  }

  private saveFCMNotifications(): void {
    try {
      const notifications = Array.from(this.fcmNotifications.entries());
      localStorage.setItem('fcm_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving FCM notifications:', error);
    }
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

      // Check if we're in a development environment that doesn't support service workers
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('webcontainer');

      if (isLocalhost && !('serviceWorker' in navigator)) {
        console.warn('Service Workers not supported in this environment, FCM functionality will be limited');
        this.isInitialized = true;
        return;
      }

      // Register service worker first
      const registration = await registerServiceWorker();
      if (!registration && !isLocalhost) {
        console.warn('Service Worker registration not available, FCM functionality will be limited');
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
          console.warn('Failed to get FCM token (may be due to environment limitations)');
          this.isInitialized = true;
        }
      } else {
        console.warn('Notification permission not granted');
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Error initializing FCM:', error);
      this.isInitialized = true;
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
          console.log('Received foreground FCM message:', payload);
          
          // Generate a unique ID for this notification if not provided
          const notificationId = payload.data?.notificationId || `fcm_${Date.now()}_${Math.random()}`;
          
          // Create FCM notification object
          const fcmNotification: FCMNotification = {
            id: notificationId,
            title: payload.notification?.title || 'FaNect Notification',
            body: payload.notification?.body || 'You have a new notification',
            timestamp: Date.now(),
            isRead: false
          };
          
          // Store FCM notification
          this.fcmNotifications.set(notificationId, fcmNotification);
          this.saveFCMNotifications();
          
          // Only show browser notification if permission is granted
          if (Notification.permission === 'granted') {
            const notificationOptions = {
              body: fcmNotification.body,
              icon: '/icon-192x192.png',
              badge: '/icon-192x192.png',
              tag: `fanect-notification-${notificationId}`,
              requireInteraction: false,
              silent: false,
              data: { 
                ...payload.data,
                notificationId,
                isUnread: true
              }
            };

            const notification = new Notification(fcmNotification.title, notificationOptions);
            
            // Handle notification click
            notification.onclick = () => {
              window.focus();
              notification.close();
              
              // Mark as read when clicked
              this.markNotificationAsRead(notificationId);
              
              // Navigate to notifications page
              if (window.location.pathname !== '/dashboard/notifications') {
                window.location.href = '/dashboard/notifications';
              }
            };

            // Auto-close after 5 seconds
            setTimeout(() => {
              notification.close();
            }, 5000);
          }
          
          // Dispatch custom event for real-time notification updates
          window.dispatchEvent(new CustomEvent('fcm-message', { 
            detail: { 
              ...payload, 
              notificationId,
              isUnread: true
            } 
          }));
          
          // Trigger notification store refresh
          window.dispatchEvent(new CustomEvent('refresh-notifications'));
        })
        .catch((err) => console.log('Failed to receive message:', err));
    } catch (error) {
      console.error('Error setting up message listener:', error);
    }
  }

  public markNotificationAsRead(notificationId: string): void {
    const notification = this.fcmNotifications.get(notificationId);
    if (notification) {
      notification.isRead = true;
      this.fcmNotifications.set(notificationId, notification);
      this.saveFCMNotifications();
      console.log(`Marked FCM notification ${notificationId} as read`);
      
      // Trigger notification count update
      window.dispatchEvent(new CustomEvent('refresh-notifications'));
    }
  }

  public getUnreadFCMNotifications(): FCMNotification[] {
    return Array.from(this.fcmNotifications.values()).filter(n => !n.isRead);
  }

  public getUnreadCount(): number {
    return this.getUnreadFCMNotifications().length;
  }

  public getAllFCMNotifications(): FCMNotification[] {
    return Array.from(this.fcmNotifications.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  public clearAllUnreadNotifications(): void {
    // Mark all FCM notifications as read
    for (const [id, notification] of this.fcmNotifications.entries()) {
      if (!notification.isRead) {
        notification.isRead = true;
        this.fcmNotifications.set(id, notification);
      }
    }
    this.saveFCMNotifications();
    console.log('Marked all FCM notifications as read');
    
    // Trigger notification count update
    window.dispatchEvent(new CustomEvent('refresh-notifications'));
  }

  public getFCMToken(): string | null {
    return this.fcmToken;
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  // Method to manually refresh FCM token
  public async refreshToken(): Promise<string | null> {
    try {
      const token = await getFCMToken();
      if (token && token !== this.fcmToken) {
        this.fcmToken = token;
        await this.sendTokenToServer(token);
      }
      return token;
    } catch (error) {
      console.error('Error refreshing FCM token:', error);
      return null;
    }
  }
}

export const fcmService = FCMService.getInstance();