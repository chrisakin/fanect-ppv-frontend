import { getFCMToken, requestNotificationPermission, onMessageListener, registerServiceWorker } from '../lib/firebase';
import axios from '../lib/axios';

export class FCMService {
  private static instance: FCMService;
  private fcmToken: string | null = null;
  private isInitialized: boolean = false;
  private unreadNotifications: Set<string> = new Set(); // Track unread FCM notifications

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
        // Don't return here for localhost - we can still try to initialize other parts
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
          
          // Load existing unread notifications
          await this.loadUnreadNotifications();
          
          this.isInitialized = true;
          console.log('FCM initialized successfully');
        } else {
          console.warn('Failed to get FCM token (may be due to environment limitations)');
          // Still mark as initialized for environments where FCM isn't fully supported
          this.isInitialized = true;
        }
      } else {
        console.warn('Notification permission not granted');
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Error initializing FCM:', error);
      // Mark as initialized even on error to prevent repeated attempts
      this.isInitialized = true;
    }
  }

  private async loadUnreadNotifications(): Promise<void> {
    try {
      // Import notification store dynamically to avoid circular dependency
      const { useNotificationStore } = await import('../store/notificationStore');
      const unreadNotifications = await useNotificationStore.getState().fetchUnreadNotifications();
      
      // Add unread notification IDs to our set
      unreadNotifications.forEach(notification => {
        if (!notification.isRead) {
          this.unreadNotifications.add(notification._id);
        }
      });
      
      console.log(`Loaded ${this.unreadNotifications.size} unread FCM notifications`);
    } catch (error) {
      console.error('Error loading unread notifications:', error);
    }
  }

  private async sendTokenToServer(token: string): Promise<void> {
    try {
      await axios.post('/notifications/token', { fcmToken: token });
      console.log('FCM token sent to server successfully');
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
      // Don't throw error - this shouldn't prevent FCM initialization
    }
  }

  private setupForegroundMessageListener(): void {
    try {
      onMessageListener()
        .then((payload: any) => {
          console.log('Received foreground FCM message:', payload);
          
          // Generate a unique ID for this notification if not provided
          const notificationId = payload.data?.notificationId || `fcm_${Date.now()}_${Math.random()}`;
          
          // Add to unread notifications set
          this.unreadNotifications.add(notificationId);
          
          // Only show browser notification if permission is granted and user wants in-app notifications
          if (Notification.permission === 'granted') {
            const notificationTitle = payload.notification?.title || 'FaNect Notification';
            const notificationOptions = {
              body: payload.notification?.body || 'You have a new notification',
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

            const notification = new Notification(notificationTitle, notificationOptions);
            
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
    this.unreadNotifications.delete(notificationId);
    console.log(`Marked FCM notification ${notificationId} as read`);
    
    // Trigger notification count update
    window.dispatchEvent(new CustomEvent('refresh-notifications'));
  }

  public getUnreadNotifications(): string[] {
    return Array.from(this.unreadNotifications);
  }

  public getUnreadCount(): number {
    return this.unreadNotifications.size;
  }

  public clearAllUnreadNotifications(): void {
    this.unreadNotifications.clear();
    console.log('Cleared all unread FCM notifications');
    
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