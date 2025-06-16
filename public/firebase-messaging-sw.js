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
      
      const notificationTitle = payload.notification?.title || 'FaNect Notification';
      const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'fanect-notification',
        requireInteraction: false,
        silent: false,
        data: payload.data || {}
      };

      // Show the notification
      return self.registration.showNotification(notificationTitle, notificationOptions);
    });

    // Handle notification click events
    self.addEventListener('notificationclick', function(event) {

      event.notification.close();
      
      // Focus or open the app when notification is clicked
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
          // If a window/tab is already open, focus it
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // If no window/tab is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow('/dashboard/notifications');
          }
        })
      );
    });

    console.log('Firebase messaging service worker initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase in service worker:', error);
  }
} else {
  console.warn('Firebase service worker not initialized - please update firebaseConfig with your actual values');
}