import {
  Menu,
  MoonIcon,
  SearchIcon,
  SunIcon,
  X,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useTheme, Theme } from "./ThemeProvider";
import { useState } from "react";
import { LoginModal } from "../modals/LoginModal";
import { useAuthStore } from "../../store/authStore";
import { clearTokens, getUser } from "../../lib/auth";

interface HeaderProps {
  withSidebar?: boolean;
  onMenuClick?: () => void;
}

export const Header = ({ withSidebar = false, onMenuClick }: HeaderProps): JSX.Element => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    logout();
    navigate('/');
  };

  const handleMenuClick = () => {
    if (withSidebar && onMenuClick) {
      onMenuClick();
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

    const handleCreateEvent = () => {
    if (isAuthenticated) {
      navigate("/dashboard/organise");
    } else {
      // open your login modal here
      setIsLoginModalOpen(true); // replace with your modal logic
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      {/* Mobile Menu Overlay */}
      {isMenuOpen && !withSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      <header className={withSidebar ? "fixed left-0 top-0 z-50 w-full md:ml-sidebar-desktop md:w-header-desktop bg-background" : "fixed top-0 left-0 right-0 bg-background z-50" }>
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between px-3 py-2">
          <Link to="/" className="text-xl font-semibold text-green-600 hover:text-green-700 transition-colors">
            FaNect
          </Link>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={theme}
              onValueChange={(value) => value && setTheme(value as Theme)}
              className="h-8 dark:bg-gray-700 bg-gray-300 rounded-full p-1"
            >
              <ToggleGroupItem
                value="dark"
                className="w-8 h-8 p-0 flex items-center justify-center rounded-full data-[state=on]:bg-gray-200 dark:data-[state=on]:bg-[#1AAA65]"
              >
                <MoonIcon className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="light"
                className="w-8 h-8 p-0 flex items-center justify-center rounded-full data-[state=on]:bg-gray-200 dark:data-[state=on]:bg-[#1AAA65]"
              >
                 <SunIcon className="w-10 h-10 dark:text-[#1AAA65]" />
              </ToggleGroupItem>
            </ToggleGroup>
            <button
              onClick={handleMenuClick}
              className="text-gray-500 p-1"
            >
              {isMenuOpen && !withSidebar ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-3 py-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2 p-2 rounded-lg border border-solid border-[#d5d7da] w-full bg-background">
            <SearchIcon className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchInputKeyDown}
              className="bg-transparent border-none outline-none w-full text-sm text-gray-400 placeholder-gray-400"
            />
          </form>
        </div>

        {/* Mobile Menu */}
        {!withSidebar && (
          <div 
            className={`md:hidden fixed right-0 top-0 bg-background transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50 shadow-lg rounded-bl-lg`}
          >
            {!isAuthenticated && (
            <div className="flex flex-col p-3 gap-3">
              <div className="flex justify-end">
                <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 p-1">
                  <X size={20} />
                </button>
              </div>
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-sm text-gray-500"
                  >
                    Create Events
                  </Button>
                  <Button
                    size="sm"
                    className="w-full bg-green-600 text-white text-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                  >
                    Log in
                  </Button>
                </>
              
            </div>)}
          </div>
        )}

        {/* Desktop/Tablet Header */}
        <div className="hidden md:flex items-center justify-between px-4 lg:px-16 py-4 my-4 mx-5 gap-3 rounded-lg bg-[#F5F5F5] dark:bg-dash-dark">
        {!isAuthenticated && (
          <Link to="/" className="text-xl font-semibold text-green-600 hover:text-green-700 transition-colors">
            FaNect
          </Link>
        )}

          <form onSubmit={handleSearch} className="flex items-center gap-2 p-2 rounded-lg border border-solid border-[#d5d7da] dark:border-[#2E483A] w-[300px]">
            <SearchIcon className="w-6 h-6 text-gray-400 cursor-pointer" onClick={handleSearch} />
            <input
              type="text"
              placeholder="Search events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchInputKeyDown}
              className="bg-transparent border-none outline-none w-full text-sm text-gray-400 dark:text-[#828B86] placeholder-gray-400"
            />
          </form>

          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={theme}
              onValueChange={(value) => value && setTheme(value as Theme)}
              className="h-10 dark:bg-gray-700 bg-gray-300 rounded-full p-1"
            >
              <ToggleGroupItem
                value="dark"
                className="w-8 h-8 p-0 flex items-center justify-center rounded-full data-[state=on]:bg-gray-200 dark:data-[state=on]:bg-[#1AAA65]"
              >
                <MoonIcon className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="light"
                className="w-8 h-8 p-0 flex items-center justify-center rounded-full data-[state=on]:bg-gray-200 dark:data-[state=on]:bg-[#1AAA65]"
              >
                <SunIcon className="w-10 h-10 dark:text-[#1AAA65]" />
              </ToggleGroupItem>
            </ToggleGroup>

            {/* {!isAuthenticated && (
              <Button
              variant="outline"
              size="lg"
              className="hidden lg:block text-md text-gray-500 rounded-lg border-[#717680] dark:border-[#2E483A] bg-[#F5F5F5] dark:bg-dash-dark"
            >
              Discover Events
            </Button>
            )} */}

            {/* <Link to="/dashboard/organise">
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer text-md text-gray-500 rounded-lg border-[#717680] dark:border-[#2E483A] bg-[#F5F5F5] dark:bg-dash-dark"
            >
              Create an Event
            </Button>
            </Link> */}

            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer text-md text-gray-500 rounded-lg border-[#717680] dark:border-[#2E483A] bg-[#F5F5F5] dark:bg-dash-dark"
              onClick={handleCreateEvent}
            >
              Create an Event
            </Button>

            {isAuthenticated ? (
              <Button
                variant="outline"
                size="lg"
                className="border-[#717680] dark:border-[#2E483A] text-[#717680] dark:text-gray-300 rounded-[10px] flex items-center gap-2.5 bg-[#F5F5F5] dark:bg-dash-dark"
              >
                <User className="w-8 h-8" />
                <span className="font-text-lg-medium">{user?.firstName || getUser()?.firstName}</span>
              </Button>
            ) : (
              <Button 
                size="lg"
                className="bg-green-600 text-white text-md rounded-lg"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};