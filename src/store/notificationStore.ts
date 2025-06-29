import { create } from 'zustand';
import axios from '../lib/axios';
import { fcmService } from '../services/fcmService';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  body?: string; // Add body field for backend compatibility
  type: string;
  isRead: boolean;
  read?: boolean; // Add read field for backend compatibility
  createdAt: string;
  updatedAt: string;
  source?: 'database' | 'fcm'; // Track notification source
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
  fetchUnreadNotifications: () => Promise<Notification[]>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  addFCMNotification: (fcmNotification: any) => void;
  updateUnreadCount: () => void;
  getUnreadCount: () => number;
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

  // Calculate unread count from current notifications + FCM notifications
  updateUnreadCount: () => {
    const state = get();
    const databaseUnreadCount = state.notifications.filter(n => !n.isRead && n.source !== 'fcm').length;
    const fcmUnreadCount = fcmService.isReady() ? fcmService.getUnreadCount() : 0;
    const totalUnreadCount = databaseUnreadCount + fcmUnreadCount;
    
    console.log('Updating unread count:', {
      databaseUnread: databaseUnreadCount,
      fcmUnread: fcmUnreadCount,
      total: totalUnreadCount
    });
    
    set({ unreadCount: totalUnreadCount });
  },

  // Get current unread count
  getUnreadCount: () => {
    const state = get();
    const databaseUnreadCount = state.notifications.filter(n => !n.isRead && n.source !== 'fcm').length;
    const fcmUnreadCount = fcmService.isReady() ? fcmService.getUnreadCount() : 0;
    return databaseUnreadCount + fcmUnreadCount;
  },

  fetchNotifications: async (page = 1) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/notifications?page=${page}&limit=20`);
      const { docs, ...paginationData } = response.data;
      
      console.log('Raw notification data from backend:', docs);
      
      // Map backend data to frontend format - handle both 'read' and 'isRead' fields
      const databaseNotifications = docs.map((notification: any) => ({
        _id: notification._id,
        title: notification.title,
        message: notification.message || notification.body || '', // Handle both message and body
        type: notification.type || 'general',
        isRead: Boolean(notification.read !== undefined ? notification.read : notification.isRead), // Use 'read' field from backend
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
        source: 'database' as const
      }));

      // Get FCM notifications and convert them to the same format
      const fcmNotifications = fcmService.isReady() ? 
        fcmService.getAllFCMNotifications().map(fcmNotif => ({
          _id: fcmNotif.id,
          title: fcmNotif.title,
          message: fcmNotif.body,
          type: 'fcm',
          isRead: fcmNotif.isRead,
          createdAt: new Date(fcmNotif.timestamp).toISOString(),
          updatedAt: new Date(fcmNotif.timestamp).toISOString(),
          source: 'fcm' as const
        })) : [];

      // Combine and sort notifications by creation date (newest first)
      const allNotifications = [...databaseNotifications, ...fcmNotifications]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log('Combined notifications:', {
        database: databaseNotifications.length,
        fcm: fcmNotifications.length,
        total: allNotifications.length,
        unread: allNotifications.filter(n => !n.isRead).length
      });
      
      set({
        notifications: allNotifications,
        pagination: paginationData,
        isLoading: false
      });

      // Update unread count based on combined notifications
      get().updateUnreadCount();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ notifications: [], isLoading: false });
    }
  },

  fetchUnreadNotifications: async () => {
    try {
      const response = await axios.get('/notifications?isRead=false&limit=50');
      const databaseUnreadNotifications = (response.data.docs || []).map((notification: any) => ({
        _id: notification._id,
        title: notification.title,
        message: notification.message || notification.body || '',
        type: notification.type || 'general',
        isRead: Boolean(notification.read !== undefined ? notification.read : notification.isRead),
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
        source: 'database' as const
      }));

      // Get FCM unread notifications
      const fcmUnreadNotifications = fcmService.isReady() ? 
        fcmService.getUnreadFCMNotifications().map(fcmNotif => ({
          _id: fcmNotif.id,
          title: fcmNotif.title,
          message: fcmNotif.body,
          type: 'fcm',
          isRead: fcmNotif.isRead,
          createdAt: new Date(fcmNotif.timestamp).toISOString(),
          updatedAt: new Date(fcmNotif.timestamp).toISOString(),
          source: 'fcm' as const
        })) : [];

      const allUnreadNotifications = [...databaseUnreadNotifications, ...fcmUnreadNotifications];
      
      console.log('Fetched unread notifications:', {
        database: databaseUnreadNotifications.length,
        fcm: fcmUnreadNotifications.length,
        total: allUnreadNotifications.length
      });
      
      // Update unread count
      set({ unreadCount: allUnreadNotifications.length });
      
      return allUnreadNotifications;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const state = get();
      const notification = state.notifications.find(n => n._id === notificationId);
      
      if (!notification) return;

      if (notification.source === 'fcm') {
        // Handle FCM notification
        fcmService.markNotificationAsRead(notificationId);
      } else {
        // Handle database notification
        await axios.patch(`/notifications/${notificationId}/read`);
      }
      
      // Update the notification in the store
      set((state) => {
        const updatedNotifications = state.notifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        
        return { notifications: updatedNotifications };
      });

      // Update unread count
      get().updateUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      set({ isMarkingAllAsRead: true });
      
      // Mark all database notifications as read
      await axios.patch('/notifications/mark-all-read');
      
      // Mark all FCM notifications as read
      if (fcmService.isReady()) {
        fcmService.clearAllUnreadNotifications();
      }
      
      console.log('Successfully marked all notifications as read');
      
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
    set((state) => {
      const updatedNotifications = [notification, ...state.notifications];
      return { notifications: updatedNotifications };
    });
    
    // Update unread count
    get().updateUnreadCount();
  },

  addFCMNotification: (fcmNotification: any) => {
    // Convert FCM notification to our format
    const notification: Notification = {
      _id: fcmNotification.id || `fcm_${Date.now()}`,
      title: fcmNotification.title || 'FaNect Notification',
      message: fcmNotification.body || fcmNotification.message || '',
      type: 'fcm',
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'fcm'
    };

    set((state) => {
      const updatedNotifications = [notification, ...state.notifications];
      return { notifications: updatedNotifications };
    });
    
    // Update unread count
    get().updateUnreadCount();
  },
}));