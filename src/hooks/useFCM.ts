import { useEffect } from 'react';
import { fcmService } from '../services/fcmService';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export const useFCM = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    // Only initialize FCM if user is authenticated and we're in browser environment
    if (isAuthenticated && typeof window !== 'undefined') {
      // Add a small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        fcmService.initializeFCM().catch(error => {
          console.warn('FCM initialization failed:', error);
        });
      }, 2000); // Increased delay to ensure service worker registration

      // Listen for FCM messages
      const handleFCMMessage = (event: CustomEvent) => {
        console.log('FCM message received:', event.detail);
        // Refresh notifications when a new message is received
        fetchNotifications().catch(error => {
          console.error('Failed to fetch notifications:', error);
        });
      };

      window.addEventListener('fcm-message', handleFCMMessage as EventListener);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('fcm-message', handleFCMMessage as EventListener);
      };
    }
  }, [isAuthenticated, fetchNotifications]);
};