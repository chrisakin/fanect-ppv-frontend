import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { clearTokens } from '../../lib/auth';
import { Header } from './Header';


const sidebarItems = [
  { icon: <img src='/icons/home.svg' className="h-6 w-6" />, label: 'Home', path: '/dashboard' },
  { icon: <img src='/icons/card-pos.svg' className="h-6 w-6" />, label: 'Streampass', path: '/dashboard/tickets' },
  { icon: <img src='/icons/music.svg' className="h-6 w-6" />, label: 'Organise Events', path: '/dashboard/organise' },
  { icon: <img src='/icons/setting.svg' className="h-6 w-6" />, label: 'Settings', path: '/dashboard/settings' },
  { icon: <img src='/icons/notification-bing.svg' className="h-6 w-6" />, label: 'Notifications', path: '/dashboard/notifications' },
  { icon: <img src='/icons/message-question.svg' className="h-6 w-6" />, label: 'Help', path: '/dashboard/help' },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearTokens();
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
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

          <nav className="flex flex-col gap-0 px-2.5 mt-4">
            {sidebarItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <Button
                  variant="ghost"
                  className={`flex h-[50px] w-full justify-start gap-[11px] px-2 py-0 rounded ${
                    isActive(item.path) ? 'bg-[#1AAA65] text-[#FAFAFA] dark:bg-select-dark' : 'text-[#A4A7AE] dark:text-[#AAAAAA]'
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
        {/* <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-background">
          <div className="h-full px-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>

            <div className="flex items-center gap-4 ml-auto">
              <ToggleGroup
                type="single"
                value={theme}
                onValueChange={(value) => value && setTheme(value as "light" | "dark")}
                className="h-8 bg-gray-100 dark:bg-gray-700 rounded-full p-1"
              >
                <ToggleGroupItem
                  value="dark"
                  className="w-6 h-6 p-0 flex items-center justify-center rounded-full data-[state=on]:bg-gray-200 dark:data-[state=on]:bg-gray-600"
                >
                  <MoonIcon className="w-4 h-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="light"
                  className="w-6 h-6 p-0 flex items-center justify-center rounded-full data-[state=on]:bg-gray-200 dark:data-[state=on]:bg-gray-600"
                >
                  <SunIcon className="w-4 h-4" />
                </ToggleGroupItem>
              </ToggleGroup>

              <Button
                variant="outline"
                className="h-auto border-[#717680] text-[#717680] dark:text-gray-300 rounded-[10px] flex items-center gap-2.5"
              >
                <User className="w-6 h-6" />
                <span className="font-text-lg-medium">{user?.name}</span>
              </Button>
            </div>
          </div>
        </header> */}
        <Header />

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};