import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { clearTokens } from '../../lib/auth';
import { Header } from './Header';
import axios from '@/lib/axios';
import { toast } from '../ui/use-toast';

const sidebarItems = [
  { icon: <img src='/icons/home.svg' className="h-6 w-6" />, label: 'Home', path: '/dashboard/home', slug:'home' },
  { icon: <img src='/icons/card-pos.svg' className="h-6 w-6" />, label: 'Streampass', path: '/dashboard/tickets', slug:'tickets' },
  { icon: <img src='/icons/music.svg' className="h-6 w-6" />, label: 'Organise Events', path: '/dashboard/organise', slug:'organise' },
  { icon: <img src='/icons/setting.svg' className="h-6 w-6" />, label: 'Settings', path: '/dashboard/settings', slug:'settings' },
  { icon: <img src='/icons/notification-bing.svg' className="h-6 w-6" />, label: 'Notifications', path: '/dashboard/notifications', slug: 'notifications' },
  { icon: <img src='/icons/message-question.svg' className="h-6 w-6" />, label: 'Help', path: '/dashboard/help', slug: 'help' },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
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

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-background mx-auto">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-[242px] bg-[#F5F5F5] dark:bg-dash-dark`}
      >
        <div className="h-full flex flex-col">
          <div className="flex h-[70px] items-center justify-between px-4 py-2.5">
            <Link to="/dashboard" className="font-display-xs-semibold text-green-600 text-[length:var(--display-xs-semibold-font-size)] tracking-[var(--display-xs-semibold-letter-spacing)] leading-[var(--display-xs-semibold-line-height)]">
              FaNect
            </Link>
            <div className='h-6 w-6 cursor-pointer md:hidden' onClick={() => setIsSidebarOpen(false)}>
              <img src="/icons/sidebar-left.svg" alt="side-icon" />
            </div>
          </div>

          <nav className="flex flex-col gap-0 px-2.5 lg:mt-4 md:mt-8 mt-16">
            {sidebarItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <Button
                onClick={() => setIsSidebarOpen(false)}
                  variant="ghost"
                  className={`flex h-[50px] w-full justify-start gap-[11px] px-2 py-0 rounded ${
                    isActive(item.slug) ? 'bg-[#1AAA65] text-[#FAFAFA] dark:bg-select-dark' : 'text-[#A4A7AE] dark:text-[#AAAAAA]'
                  }`}
                >
                  {item.icon}
                  <span className="font-small text-base tracking-[-0.32px] leading-6">
                    {item.label}
                  </span>
                </Button>
              </Link>
            ))}
          </nav>

          <div className="mt-auto mb-9 px-2.5">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex h-[50px] w-full justify-start gap-[11px] px-2 py-0 text-gray-400 dark:text-gray-300 rounded"
            >
              <img src='/icons/logout.svg' className="h-6 w-6" />
              <span className="font-medium text-base tracking-[-0.32px] leading-6">
                Log Out
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:ml-[242px]">
        {/* Header */}
        <Header withSidebar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />

        {/* Page content */}
        <main className="p-6 mt-[100px]">{children}</main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};