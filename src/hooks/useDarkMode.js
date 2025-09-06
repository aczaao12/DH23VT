import { useEffect } from 'react';

const useDarkMode = () => {
  // Ensure the dark-mode class is never present on initial load and subsequent renders
  useEffect(() => {
    document.documentElement.classList.remove('dark-mode');
  }, []); // Run once on mount

  const isDarkMode = false;
  const toggleDarkMode = () => {
    // No operation needed as dark mode is disabled
  };

  return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;
