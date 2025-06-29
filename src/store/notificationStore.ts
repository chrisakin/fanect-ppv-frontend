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
  isMarkingAllAsRead: boolean;
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
  isMarkingAllAsRead: false,
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
      
      // Ensure we're working with the correct data structure
      const notifications = docs.map((notification: any) => ({
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: Boolean(notification.isRead), // Ensure boolean type
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      }));
      
      set({
        notifications,
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
      const count = response.data.count || 0;
      console.log('Fetched unread count from backend:', count);
      set({ unreadCount: count });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      set({ unreadCount: 0 });
    }
  },

  fetchUnreadNotifications: async () => {
    try {
      const response = await axios.get('/notifications?isRead=false&limit=50');
      const unreadNotifications = (response.data.docs || []).map((notification: any) => ({
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: Boolean(notification.isRead),
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      }));
      
      console.log('Fetched unread notifications:', unreadNotifications.length);
      
      // Update unread count based on actual unread notifications
      const actualUnreadCount = unreadNotifications.filter((n: any )=> !n.isRead).length;
      set({ unreadCount: actualUnreadCount });
      
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
      set((state) => {
        const updatedNotifications = state.notifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        
        // Calculate new unread count
        const newUnreadCount = Math.max(0, state.unreadCount - 1);
        
        return {
          notifications: updatedNotifications,
          unreadCount: newUnreadCount
        };
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      set({ isMarkingAllAsRead: true });
      
      // Call the backend endpoint to mark ALL notifications as read
      await axios.patch('/notifications/mark-all-read');
      
      console.log('Successfully marked all notifications as read on backend');
      
      // Update all notifications in the current store to read
      set((state) => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadCount: 0,
        isMarkingAllAsRead: false
      }));
      
      console.log('Updated local notification state - all marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      set({ isMarkingAllAsRead: false });
      throw error; // Re-throw to handle in component
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1
    }));
  },
}));