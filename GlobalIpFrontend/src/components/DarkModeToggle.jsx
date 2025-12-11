import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <HiSun className="text-2xl text-yellow-400" />
      ) : (
        <HiMoon className="text-2xl text-gray-600" />
      )}
    </button>
  );
}
