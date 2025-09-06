import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export const useResponsive = () => {
  const isDesktopOrLaptop = useMediaQuery('(min-width: 992px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 991px)');
  const isMobile = useMediaQuery('(max-width: 767px)');

  return { isDesktopOrLaptop, isTablet, isMobile };
};