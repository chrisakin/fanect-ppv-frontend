import {
  Menu,
  MoonIcon,
  SearchIcon,
  SunIcon,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useTheme, Theme } from "./ThemeProvider";
import { useState } from "react";
import { LoginModal } from "../LoginModal";

export const Header = (): JSX.Element => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      <header className="relative bg-background z-50">
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
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 p-1"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-3 py-2">
          <div className="flex items-center gap-2 p-2 rounded-lg border border-solid border-[#d5d7da] w-full bg-background">
            <SearchIcon className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events"
              className="bg-transparent border-none outline-none w-full text-sm text-gray-400 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden fixed right-0 top-0 bg-background transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50 shadow-lg rounded-bl-lg`}
        >
          <div className="flex flex-col p-3 gap-3">
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 p-1">
                <X size={20} />
              </button>
            </div>
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
          </div>
        </div>

        {/* Desktop/Tablet Header */}
        <div className="hidden md:flex items-center justify-between px-4 lg:px-16 py-3 gap-3">
          <Link to="/" className="text-xl font-semibold text-green-600 hover:text-green-700 transition-colors">
            FaNect
          </Link>

          <div className="flex items-center gap-2 p-2 rounded-lg border border-solid border-[#d5d7da] w-[300px]">
            <SearchIcon className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events"
              className="bg-transparent border-none outline-none w-full text-sm text-gray-400 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={theme}
              onValueChange={(value) => value && setTheme(value as Theme)}
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
              size="sm"
              className="hidden lg:block text-sm text-gray-500 rounded-lg border-[#717680]"
            >
              Discover Events
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-sm text-gray-500 rounded-lg border-[#717680]"
            >
              Create Events
            </Button>

            <Button 
              size="sm"
              className="bg-green-600 text-white text-sm rounded-lg"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Log in
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};