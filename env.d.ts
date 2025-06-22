/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;
    readonly VITE_FIREBASE_VAPID_KEY: string;
    readonly VITE_STREAMING_PROVIDER: string;
    readonly VITE_AGORA_APP_ID: string;
    readonly VITE_AWS_IVS_REGION: string;
    readonly VITE_AWS_IVS_CHAT_REGION: string;
    readonly VITE_CHAT_API_ENDPOINT: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }