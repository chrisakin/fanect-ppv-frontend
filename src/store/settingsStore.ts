import { create } from 'zustand';
import axios from '../lib/axios';

interface UserSettings {
  email: string;
  firstName: string;
  lastName: string;
  notifications: {
    appNotifLiveStreamBegins: boolean;
    appNotifLiveStreamEnds: boolean;
    emailNotifLiveStreamBegins: boolean;
    emailNotifLiveStreamEnds: boolean;
  };
}

interface WithdrawalDetails {
  bankName: string;
  bankType: string;
  bankRoutingNumber: string;
  address: string;
  accountNumber: string;
  accountName: string;
}

interface SettingsStore {
  settings: UserSettings;
  withdrawalDetails: WithdrawalDetails;
  isLoading: boolean;
  isSaving: boolean;
  isWithdrawalLoading: boolean;
  isWithdrawalSaving: boolean;
  fetchProfile: () => Promise<void>;
  fetchWithdrawalDetails: () => Promise<void>;
  updateField: (field: keyof UserSettings, value: string) => void;
  updateWithdrawalField: (field: keyof WithdrawalDetails, value: string) => void;
  updateNotification: (field: keyof UserSettings['notifications'], value: boolean) => void;
  saveSettings: () => Promise<void>;
  saveWithdrawalDetails: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: {
    email: '',
    firstName: '',
    lastName: '',
    notifications: {
      appNotifLiveStreamBegins: false,
      appNotifLiveStreamEnds: false,
      emailNotifLiveStreamBegins: false,
      emailNotifLiveStreamEnds: false,
    },
  },
  withdrawalDetails: {
    bankName: '',
    bankType: '',
    bankRoutingNumber: '',
    address: '',
    accountNumber: '',
    accountName: '',
  },
  isLoading: false,
  isSaving: false,
  isWithdrawalLoading: false,
  isWithdrawalSaving: false,

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

  fetchWithdrawalDetails: async () => {
    try {
      set({ isWithdrawalLoading: true });
      const response = await axios.get('/withdrawal/details');
      const { withdrawals } = response.data;
      
      set({
        withdrawalDetails: {
          bankName: withdrawals?.bankName || '',
          bankType: withdrawals?.bankType || '',
          bankRoutingNumber: withdrawals?.bankRoutingNumber || '',
          address: withdrawals?.address || '',
          accountNumber: withdrawals?.accountNumber || '',
          accountName: withdrawals?.accountName || '',
        },
        isWithdrawalLoading: false,
      });
    } catch (error) {
      console.error('Error fetching withdrawal details:', error);
      set({ 
        withdrawalDetails: {
          bankName: '',
          bankType: '',
          bankRoutingNumber: '',
          address: '',
          accountNumber: '',
          accountName: '',
        },
        isWithdrawalLoading: false 
      });
    }
  },

  updateField: (field, value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [field]: value,
      },
    })),

  updateWithdrawalField: (field, value) =>
    set((state) => ({
      withdrawalDetails: {
        ...state.withdrawalDetails,
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

  saveWithdrawalDetails: async () => {
    try {
      set({ isWithdrawalSaving: true });
      const { withdrawalDetails } = get();
      
      await axios.post('/withdrawal/details', withdrawalDetails);
      
      set({ isWithdrawalSaving: false });
      return Promise.resolve();
    } catch (error) {
      set({ isWithdrawalSaving: false });
      return Promise.reject(error);
    }
  },
}));