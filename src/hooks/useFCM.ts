import { useEffect } from 'react';
import { fcmService } from '../services/fcmService';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export const useFCM = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Initialize FCM when user is authenticated
      fcmService.initializeFCM();

      // Listen for FCM messages
      const handleFCMMessage = (event: CustomEvent) => {
        console.log('FCM message received:', event.detail);
        // Refresh notifications when a new message is received
        fetchNotifications();
      };

      window.addEventListener('fcm-message', handleFCMMessage as EventListener);

      return () => {
        window.removeEventListener('fcm-message', handleFCMMessage as EventListener);
      };
    }
  }, [isAuthenticated, fetchNotifications]);
};