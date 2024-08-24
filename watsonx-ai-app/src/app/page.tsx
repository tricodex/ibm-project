'use client';

import { useState } from 'react';
import { useWatson } from '@/hooks/useWatson';
import { WATSON_MODELS } from '@/constants/watsonModels';
import { TextGenerationParams, WatsonxResponse } from '@/types/watsonx';

export default function Home() {
  const [input, setInput] = useState('');
  const [modelId, setModelId] = useState<keyof typeof WATSON_MODELS>('GRANITE_13B_CHAT_V2');
  const [response, setResponse] = useState<WatsonxResponse | null>(null);
  const { generateText, isLoading } = useWatson();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const params: TextGenerationParams = {
      input,
      modelId,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 100,
      },
    };

    const result = await generateText(params);
    setResponse(result);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">WatsonX.AI Text Generation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="input" className="block mb-2">Input Text:</label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="model" className="block mb-2">Model:</label>
          <select
            id="model"
            value={modelId}
            onChange={(e) => setModelId(e.target.value as keyof typeof WATSON_MODELS)}
            className="w-full p-2 border rounded"
          >
            {Object.entries(WATSON_MODELS).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Text'}
        </button>
      </form>
      {response && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Generated Text:</h2>
          <p className="p-4 bg-gray-100 rounded">{response.generated_text}</p>
        </div>
      )}
    </main>
  );
}