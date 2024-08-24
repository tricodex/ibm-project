import { useState, useEffect } from 'react';
import { useWatson } from './useWatson';
import { TextGenerationParams } from '@/types/watsonx';

export const useDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMessagesSectionVisible, setIsMessagesSectionVisible] = useState(false);
  const { generateText } = useWatson();

  useEffect(() => {
    // Check user's preferred color scheme
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

  const generateProjectInsights = async (context: string) => {
    const params: TextGenerationParams = {
      input: `Given the following context about a coding project, provide insights and suggestions: ${context}`,
      modelId: 'GRANITE_13B_CHAT_V2',
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 100,
      },
    };

    const response = await generateText(params);
    return response?.generated_text || '';
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