import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const htmlElement = document.documentElement;

    const updateTheme = () => {
      if (htmlElement.classList.contains('dark')) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    // Initial theme check
    updateTheme();

    // Observe changes to the 'dark' class on the html element
    const observer = new MutationObserver(updateTheme);
    observer.observe(htmlElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}