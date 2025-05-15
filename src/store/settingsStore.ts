import { create } from 'zustand';

interface UserSettings {
  email: string;
  firstName: string;
  lastName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  notifications: {
    inApp: {
      followMe: boolean;
      streamBegins: boolean;
      streamEnds: boolean;
    };
    email: {
      followMe: boolean;
      streamBegins: boolean;
      streamEnds: boolean;
    };
  };
}

interface SettingsStore {
  settings: UserSettings;
  updateField: (field: keyof UserSettings, value: string) => void;
  updateNotification: (type: 'inApp' | 'email', field: string, value: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    email: 'wunmi@gmail.com',
    firstName: 'Omowunmi',
    lastName: 'Ola',
    bankName: 'Guaranty Trust Bank',
    accountNumber: '0217703342',
    accountName: 'Omowunmi Ola',
    notifications: {
      inApp: {
        followMe: true,
        streamBegins: true,
        streamEnds: false,
      },
      email: {
        followMe: true,
        streamBegins: true,
        streamEnds: true,
      },
    },
  },
  updateField: (field, value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [field]: value,
      },
    })),
  updateNotification: (type, field, value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        notifications: {
          ...state.settings.notifications,
          [type]: {
            ...state.settings.notifications[type],
            [field]: value,
          },
        },
      },
    })),
}));