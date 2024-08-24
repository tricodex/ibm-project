import { useState } from 'react';
import { TextGenerationParams, WatsonxResponse } from '@/types/watsonx';

export const useWatson = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateText = async (params: TextGenerationParams): Promise<WatsonxResponse | null> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/watsonx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to generate text');
      }

      const data: WatsonxResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating text:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateText,
    isLoading,
  };
};