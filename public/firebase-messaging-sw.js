importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAv2J2KxX0s6ToG_MyqKct95i9UJWK0M4M",
  authDomain: "fanect-ppv-df7d7.firebaseapp.com",
  projectId: "fanect-ppv-df7d7",
  storageBucket: "fanect-ppv-df7d7.firebasestorage.app",
  messagingSenderId: "1083480182974",
  appId: "1:1083480182974:web:2d741ab010ee95c5878eef",
  measurementId: "G-C0W89Y3NEL"
};

// Check if Firebase config is properly set (not using placeholder values)
const isConfigValid = firebaseConfig.apiKey.startsWith('AIzaSy') && 
                     !firebaseConfig.projectId.includes('your-project-id');

if (isConfigValid) {
  try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function(payload) {
      console.log('Received background message ', payload);
      
      // Generate unique notification ID
      const notificationId = payload.data?.notificationId || `fcm_bg_${Date.now()}_${Math.random()}`;
      
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
          isUnread: true,
          timestamp: Date.now()
        },
        actions: [
          {
            action: 'view',
            title: 'View'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      };

      // Store unread notification in localStorage for persistence
      try {
        const unreadNotifications = JSON.parse(localStorage.getItem('fcm_unread_notifications') || '[]');
        unreadNotifications.push({
          id: notificationId,
          title: notificationTitle,
          body: notificationOptions.body,
          timestamp: Date.now(),
          isUnread: true
        });
        localStorage.setItem('fcm_unread_notifications', JSON.stringify(unreadNotifications));
      } catch (error) {
        console.error('Error storing unread notification:', error);
      }

      // Show the notification
      return self.registration.showNotification(notificationTitle, notificationOptions);
    });

    // Handle notification click events
    self.addEventListener('notificationclick', function(event) {
      console.log('Notification clicked:', event);

      const notificationId = event.notification.data?.notificationId;
      
      event.notification.close();
      
      // Handle action clicks
      if (event.action === 'dismiss') {
        // Mark as read in localStorage
        if (notificationId) {
          try {
            const unreadNotifications = JSON.parse(localStorage.getItem('fcm_unread_notifications') || '[]');
            const updatedNotifications = unreadNotifications.filter(n => n.id !== notificationId);
            localStorage.setItem('fcm_unread_notifications', JSON.stringify(updatedNotifications));
          } catch (error) {
            console.error('Error updating unread notifications:', error);
          }
        }
        return;
      }
      
      // For 'view' action or default click
      if (event.action === 'view' || !event.action) {
        // Mark as read in localStorage
        if (notificationId) {
          try {
            const unreadNotifications = JSON.parse(localStorage.getItem('fcm_unread_notifications') || '[]');
            const updatedNotifications = unreadNotifications.filter(n => n.id !== notificationId);
            localStorage.setItem('fcm_unread_notifications', JSON.stringify(updatedNotifications));
          } catch (error) {
            console.error('Error updating unread notifications:', error);
          }
        }

        // Focus or open the app when notification is clicked
        event.waitUntil(
          clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // If a window/tab is already open, focus it and navigate to notifications
            for (let i = 0; i < clientList.length; i++) {
              const client = clientList[i];
              if (client.url.includes(self.location.origin) && 'focus' in client) {
                client.focus();
                // Try to navigate to notifications page
                if (client.navigate) {
                  return client.navigate('/dashboard/notifications');
                }
                return client;
              }
            }
            
            // If no window/tab is open, open a new one
            if (clients.openWindow) {
              return clients.openWindow('/dashboard/notifications');
            }
          })
        );
      }
    });

    // Handle push events (for when the app is closed)
    self.addEventListener('push', function(event) {
      console.log('Push event received:', event);
      
      if (event.data) {
        const payload = event.data.json();
        const notificationId = payload.data?.notificationId || `fcm_push_${Date.now()}_${Math.random()}`;
        
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
            isUnread: true,
            timestamp: Date.now()
          },
          actions: [
            {
              action: 'view',
              title: 'View'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        };

        // Store unread notification in localStorage
        try {
          const unreadNotifications = JSON.parse(localStorage.getItem('fcm_unread_notifications') || '[]');
          unreadNotifications.push({
            id: notificationId,
            title: notificationTitle,
            body: notificationOptions.body,
            timestamp: Date.now(),
            isUnread: true
          });
          localStorage.setItem('fcm_unread_notifications', JSON.stringify(unreadNotifications));
        } catch (error) {
          console.error('Error storing unread notification:', error);
        }

        event.waitUntil(
          self.registration.showNotification(notificationTitle, notificationOptions)
        );
      }
    });

    console.log('Firebase messaging service worker initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase in service worker:', error);
  }
} else {
  console.warn('Firebase service worker not initialized - please update firebaseConfig with your actual values');
}