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
  isLoading: boolean;
  pagination: PaginationData;
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
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
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ notifications: [], isLoading: false });
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
        )
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
        }))
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },
}));