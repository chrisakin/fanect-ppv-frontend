import { create } from 'zustand';
import axios from '../lib/axios';

interface UserSettings {
  email: string;
  firstName: string;
  lastName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  notifications: {
    appNotifLiveStreamBegins: boolean;
    appNotifLiveStreamEnds: boolean;
    emailNotifLiveStreamBegins: boolean;
    emailNotifLiveStreamEnds: boolean;
  };
}

interface SettingsStore {
  settings: UserSettings;
  isLoading: boolean;
  isSaving: boolean;
  fetchProfile: () => Promise<void>;
  updateField: (field: keyof UserSettings, value: string) => void;
  updateNotification: (field: keyof UserSettings['notifications'], value: boolean) => void;
  saveSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: {
    email: '',
    firstName: '',
    lastName: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    notifications: {
      appNotifLiveStreamBegins: false,
      appNotifLiveStreamEnds: false,
      emailNotifLiveStreamBegins: false,
      emailNotifLiveStreamEnds: false,
    },
  },
  isLoading: false,
  isSaving: false,

  fetchProfile: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get('/auth/profile');
      const profile = response.data;
      
      set({
        settings: {
          email: profile.email || '',
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          bankName: profile.bankName || '',
          accountNumber: profile.accountNumber || '',
          accountName: profile.accountName || '',
          notifications: {
            appNotifLiveStreamBegins: profile.appNotifLiveStreamBegins || false,
            appNotifLiveStreamEnds: profile.appNotifLiveStreamEnds || false,
            emailNotifLiveStreamBegins: profile.emailNotifLiveStreamBegins || false,
            emailNotifLiveStreamEnds: profile.emailNotifLiveStreamEnds || false,
          },
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ isLoading: false });
    }
  },

  updateField: (field, value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [field]: value,
      },
    })),

  updateNotification: (field, value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        notifications: {
          ...state.settings.notifications,
          [field]: value,
        },
      },
    })),

  saveSettings: async () => {
    try {
      set({ isSaving: true });
      const { settings } = get();
      
      await axios.put('/auth/profile', {
        firstName: settings.firstName,
        lastName: settings.lastName,
        bankName: settings.bankName,
        accountNumber: settings.accountNumber,
        accountName: settings.accountName,
        appNotifLiveStreamBegins: settings.notifications.appNotifLiveStreamBegins,
        appNotifLiveStreamEnds: settings.notifications.appNotifLiveStreamEnds,
        emailNotifLiveStreamBegins: settings.notifications.emailNotifLiveStreamBegins,
        emailNotifLiveStreamEnds: settings.notifications.emailNotifLiveStreamEnds,
      });
      
      set({ isSaving: false });
      return Promise.resolve();
    } catch (error) {
      set({ isSaving: false });
      return Promise.reject(error);
    }
  },
}));