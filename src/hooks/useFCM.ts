import { useEffect } from 'react';
import { fcmService } from '../services/fcmService';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export const useFCM = () => {
  const { isAuthenticated } = useAuthStore();
  const { updateUnreadCount } = useNotificationStore();

  useEffect(() => {
    // Only initialize FCM if user is authenticated and we're in browser environment
    if (isAuthenticated && typeof window !== 'undefined') {
      // Add a small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        fcmService.initializeFCM().catch(error => {
          console.warn('FCM initialization failed:', error);
        });
      }, 1000);

      // Listen for FCM messages and update notification store
      const handleFCMMessage = (event: CustomEvent) => {
        console.log('FCM message received in hook:', event.detail);
        
        // Update unread count when new FCM notification arrives
        updateUnreadCount();
      };

      const handleRefreshNotifications = () => {
        console.log('Refreshing notifications from FCM hook');
        updateUnreadCount();
      };

      window.addEventListener('fcm-message', handleFCMMessage as EventListener);
      window.addEventListener('refresh-notifications', handleRefreshNotifications);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('fcm-message', handleFCMMessage as EventListener);
        window.removeEventListener('refresh-notifications', handleRefreshNotifications);
      };
    }
  }, [isAuthenticated, updateUnreadCount]);

  // Periodically refresh unread count
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        // Refresh FCM token every 30 minutes
        fcmService.refreshToken().catch(error => {
          console.warn('Failed to refresh FCM token:', error);
        });
        
        // Update unread count every 5 minutes
        updateUnreadCount();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, updateUnreadCount]);
};