import { useState, useEffect } from 'react';
import { useWatson } from './useWatson';

export const useDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMessagesSectionVisible, setIsMessagesSectionVisible] = useState(false);
  const { generateProjectInsights } = useWatson();

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const toggleMessagesSection = () => {
    setIsMessagesSectionVisible((prev) => !prev);
  };

  return {
    isDarkMode,
    viewMode,
    isMessagesSectionVisible,
    toggleDarkMode,
    toggleViewMode,
    toggleMessagesSection,
    generateProjectInsights,
  };
};