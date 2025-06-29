import { useEffect } from 'react';
import { fcmService } from '../services/fcmService';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export const useFCM = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    // Only initialize FCM if user is authenticated and we're in browser environment
    if (isAuthenticated && typeof window !== 'undefined') {
      // Add a small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        fcmService.initializeFCM().catch(error => {
          console.warn('FCM initialization failed:', error);
        });
      }, 1000); // Reduced delay for faster initialization

      // Listen for FCM messages and refresh notifications
      const handleFCMMessage = (event: CustomEvent) => {
        console.log('FCM message received in hook:', event.detail);
        
        // Only refresh database notifications, FCM notifications are handled separately
        fetchUnreadCount().catch(error => {
          console.error('Failed to fetch unread count:', error);
        });
      };

      const handleRefreshNotifications = () => {
        fetchUnreadCount().catch(error => {
          console.error('Failed to refresh notifications:', error);
        });
      };

      window.addEventListener('fcm-message', handleFCMMessage as EventListener);
      window.addEventListener('refresh-notifications', handleRefreshNotifications);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('fcm-message', handleFCMMessage as EventListener);
        window.removeEventListener('refresh-notifications', handleRefreshNotifications);
      };
    }
  }, [isAuthenticated, fetchUnreadCount]);

  // Periodically refresh FCM token and unread count
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        // Refresh FCM token every 30 minutes
        fcmService.refreshToken().catch(error => {
          console.warn('Failed to refresh FCM token:', error);
        });
        
        // Refresh unread count every 5 minutes
        fetchUnreadCount().catch(error => {
          console.error('Failed to refresh unread count:', error);
        });
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchUnreadCount]);
};