import { create } from 'zustand';
import axios from '../lib/axios';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  limit: number;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  pagination: PaginationData;
  fetchNotifications: (page?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  fetchUnreadNotifications: () => Promise<Notification[]>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  pagination: {
    totalDocs: 0,
    totalPages: 1,
    currentPage: 1,
    nextPage: null,
    previousPage: null,
    limit: 20
  },

  fetchNotifications: async (page = 1) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/notifications?page=${page}&limit=20`);
      const { docs, ...paginationData } = response.data;
      
      set({
        notifications: docs,
        pagination: paginationData,
        isLoading: false
      });

      // Also update unread count
      get().fetchUnreadCount();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ notifications: [], isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await axios.get('/notifications/unread-count');
      set({ unreadCount: response.data.count || 0 });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      set({ unreadCount: 0 });
    }
  },

  fetchUnreadNotifications: async () => {
    try {
      const response = await axios.get('/notifications?isRead=false&limit=50');
      const unreadNotifications = response.data.docs || [];
      
      // Update unread count
      set({ unreadCount: unreadNotifications.length });
      
      return unreadNotifications;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await axios.patch(`/notifications/${notificationId}/read`);
      
      // Update the notification in the store
      set((state) => ({
        notifications: state.notifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      const { notifications } = get();
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      // Mark all unread notifications as read
      await Promise.all(
        unreadNotifications.map(notification =>
          axios.patch(`/notifications/${notification._id}/read`)
        )
      );
      
      // Update all notifications to read in the store
      set((state) => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1
    }));
  },
}));