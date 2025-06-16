import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Check if all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_VAPID_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.warn('Missing Firebase environment variables:', missingVars);
}

const firebaseConfig = {
  apiKey: "AIzaSyAv2J2KxX0s6ToG_MyqKct95i9UJWK0M4M",
  authDomain: "fanect-ppv-df7d7.firebaseapp.com",
  projectId: "fanect-ppv-df7d7",
  storageBucket: "fanect-ppv-df7d7.firebasestorage.app",
  messagingSenderId: "1083480182974",
  appId: "1:1083480182974:web:2d741ab010ee95c5878eef",
  measurementId: "G-C0W89Y3NEL"
};
// Only initialize Firebase if all required config is present
let app: any = null;
let messaging: any = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    
    // Only initialize messaging if we're in a browser environment and service worker is supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      messaging = getMessaging(app);
    }
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { messaging };

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      return true;
    } else {
      console.log('Notification permission denied.');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.warn('Firebase messaging not initialized');
      return null;
    }

    if (!import.meta.env.VITE_FIREBASE_VAPID_KEY) {
      console.error('VAPID key is missing');
      return null;
    }

    // Check if service worker is registered
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;

const token = await getToken(messaging, {
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  serviceWorkerRegistration: await navigator.serviceWorker.ready, // ✅ This is the fix
});
    
    if (token) {
      return token;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.warn('Firebase messaging not initialized');
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });