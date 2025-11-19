import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Button } from '../ui/button';
import { clearTokens } from '../../lib/auth';
import { Header } from './Header';
import axios from '@/lib/axios';
import { toast } from '../ui/use-toast';
import { streampassSessionService } from '../../services/streampassSessionService';
import HomeIcon from '../icons/HomeIcon';
import CardPosIcon from '../icons/CardPosIcon';
import MusicIcon from '../icons/MusicIcon';
import SettingsIcon from '../icons/SettingsIcon';
import NotificationBingIcon from '../icons/NotificationBingIcon';
import MessageQuestionIcon from '../icons/MessageQuestionIcon';
import LogoutIcon from '../icons/LogoutIcon';

/**
 * SidebarItem
 *
 * Structure for a single navigation item in the sidebar.
 *  - icon: React element for the sidebar icon
 *  - label: Display text for the menu item
 *  - path: Route path for navigation
 *  - slug: URL segment used for active state matching
 *  - showBadge: (optional) Whether to show notification badge on this item
 *
 * Example:
 *   { icon: <HomeIcon />, label: 'Home', path: '/dashboard/home', slug: 'home' }
 */
interface SidebarItem {
  icon: React.ReactElement;
  label: string;
  path: string;
  slug: string;
  showBadge?: boolean;
}

/**
 * sidebarItems
 *
 * Configuration array defining all sidebar navigation menu items.
 * Maps icons, labels, and routes for the main dashboard sections.
 *
 * Items:
 *  1. Home – Dashboard home page
 *  2. Streampass – Ticket/subscription management
 *  3. Organise Events – Event creation and management
 *  4. Settings – User preferences and account settings
 *  5. Notifications – Notification center (with badge support)
 *  6. Help – Help and support resources
 */
const sidebarItems = [
  { icon: <HomeIcon className="!h-6 !w-6" />, label: 'Home', path: '/dashboard/home', slug:'home' },
  { icon: <CardPosIcon className="!h-6 !w-6" />, label: 'Streampass', path: '/dashboard/tickets', slug:'tickets' },
  { icon: <MusicIcon className="!h-6 !w-6" />, label: 'Organise Events', path: '/dashboard/organise', slug:'organise' },
  { icon: <SettingsIcon className="!h-6 !w-6" />, label: 'Settings', path: '/dashboard/settings', slug:'settings' },
  { icon: <NotificationBingIcon className="!h-6 !w-6" />, label: 'Notifications', path: '/dashboard/notifications', slug: 'notifications', showBadge: true },
  { icon: <MessageQuestionIcon className="!h-6 !w-6" />, label: 'Help', path: '/dashboard/help', slug: 'help' },
];

/**
 * DashboardLayout
 *
 * Main layout wrapper component for authenticated dashboard pages.
 * Provides a persistent sidebar, header, and main content area.
 *
 * Features:
 *  - Fixed left sidebar with navigation menu (collapsible on mobile)
 *  - Responsive design: sidebar hidden on mobile unless toggled, always visible on desktop (md+)
 *  - Header with notifications and mobile menu toggle
 *  - Real-time notification badge on sidebar (unread count)
 *  - Notification listener: updates on FCM messages and manual refresh events
 *  - Periodic notification sync (every 30 seconds)
 *  - Session cleanup on logout
 *  - Active route highlighting in sidebar
 *  - Mobile backdrop overlay when sidebar is open
 *  - Dark mode support throughout
 *
 * Arguments:
 *  - children: React.ReactNode – Page content to render below header
 *
 * Returns: JSX.Element
 *
 * Usage:
 *   <DashboardLayout>
 *     <DashboardHome />
 *   </DashboardLayout>
 */
export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuthStore();
  const { unreadCount, updateUnreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Effect: Initialize and maintain notification sync
   *
   * Lifecycle:
   *  1. On mount: Initial update of unread count
   *  2. Listen for 'refresh-notifications' event (manual trigger)
   *  3. Listen for 'fcm-message' event (Firebase Cloud Messaging)
   *  4. Periodic update every 30 seconds to sync with backend
   *  5. On unmount: Cleanup all listeners and interval
   */
  useEffect(() => {
    // Initial update
    updateUnreadCount();

    // Listen for real-time notification updates
    const handleRefreshNotifications = () => {
      console.log('Refreshing notification counts in sidebar...');
      updateUnreadCount();
    };

    const handleFcmMessage = (event: CustomEvent) => {
      console.log('FCM message received in sidebar:', event.detail);
      updateUnreadCount();
    };

    window.addEventListener('refresh-notifications', handleRefreshNotifications);
    window.addEventListener('fcm-message', handleFcmMessage as EventListener);

    // Periodic update every 30 seconds
    const interval = setInterval(() => {
      updateUnreadCount();
    }, 30000);

    return () => {
      window.removeEventListener('refresh-notifications', handleRefreshNotifications);
      window.removeEventListener('fcm-message', handleFcmMessage as EventListener);
      clearInterval(interval);
    };
  }, [updateUnreadCount]);

  /**
   * Effect: Reset unread count when navigating to notifications page
   *
   * When user visits the notifications page, waits 1 second (to allow page load),
   * then refreshes the unread count (which typically becomes 0 after marking as read).
   */
  useEffect(() => {
    if (location.pathname === '/dashboard/notifications') {
      // Small delay to allow page to load and mark notifications as read
      setTimeout(() => {
        updateUnreadCount();
      }, 1000);
    }
  }, [location.pathname, updateUnreadCount]);

  /**
   * handleLogout
   *
   * Handles user logout process with cleanup:
   *  1. Cleanup all active streampass sessions
   *  2. Call backend logout endpoint (may fail, but continues anyway)
   *  3. Clear local auth tokens
   *  4. Update auth store state
   *  5. Navigate to home page
   *  6. Show success toast notification
   *
   * Error Handling: Logs API errors but continues with local cleanup
   */
  const handleLogout = async () => {
    try {
      // Clean up all streampass sessions before logout
      streampassSessionService.cleanupAllSessions();
      
      // Call logout endpoint
      await axios.post('/auth/logout');
    } catch (error) {
      // Even if the API call fails, we still want to log out locally
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear tokens and logout locally
      clearTokens();
      logout();
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  /**
   * isActive
   *
   * Determines if a sidebar item is currently active based on the current route.
   * Checks if the current pathname includes the provided slug.
   *
   * Arguments:
   *  - path: string – Sidebar item slug to match against current location
   *
   * Returns: boolean – True if the current path includes the slug
   *
   * Example:
   *   isActive('home') → true if pathname is '/dashboard/home' or '/dashboard/home/...'
   */
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-background mx-auto">
      {/* Sidebar: Fixed left navigation panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-[242px] bg-[#F5F5F5] dark:bg-dash-dark`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header: Logo and mobile close button */}
          <div className="flex h-[70px] items-center justify-between px-4 py-2.5">
            <Link to="/dashboard" className="font-display-xs-semibold text-green-600 text-[length:var(--display-xs-semibold-font-size)] tracking-[var(--display-xs-semibold-letter-spacing)] leading-[var(--display-xs-semibold-line-height)]">
              FaNect
            </Link>
            {/* Mobile close button */}
            <div className='h-6 w-6 cursor-pointer md:hidden' onClick={() => setIsSidebarOpen(false)}>
              <img src="/icons/sidebar-left.svg" alt="side-icon" />
            </div>
          </div>

          {/* Navigation menu: Sidebar items mapped from sidebarItems array */}
          <nav className="flex flex-col gap-0 px-2.5 lg:mt-4 md:mt-8 mt-16">
            {sidebarItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <Button
                onClick={() => setIsSidebarOpen(false)}
                  variant="ghost"
                  className={`flex h-[50px] w-full justify-start gap-[11px] px-2 py-0 rounded relative ${
                    isActive(item.slug) ? 'bg-[#1AAA65] hover:!bg-[#1AAA65] hover:!text-[#FAFAFA] text-[#FAFAFA] dark:bg-select-dark' : 'text-[#717680] dark:text-[#AAAAAA] dark:hover:!text-white hover:!bg-transparent'
                  }`}
                >
                  <div className="relative">
                    {item.icon}
                    {/* Notification Badge: Shows unread count (red badge) only for notifications item */}
                    {item.showBadge && unreadCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </div>
                    )}
                  </div>
                  <span className="font-small text-base tracking-[-0.32px] leading-6">
                    {item.label}
                  </span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* Sidebar footer: Logout button */}
          <div className="mt-auto mb-9 px-2.5">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex h-[50px] w-full justify-start gap-[11px] px-2 py-0 text-gray-500 dark:text-gray-300 rounded dark:hover:!text-white hover:!bg-transparent"
            >
              <LogoutIcon className="!h-6 !w-6" />
              <span className="font-medium text-base tracking-[-0.32px] leading-6">
                Log Out
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content area: Header + Page content */}
      <div className="md:ml-[242px]">
        {/* Header: Navigation and notifications */}
        <Header withSidebar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />

        {/* Page content: Children rendered here */}
        <main className="mt-[100px]">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar backdrop: Semi-transparent overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};