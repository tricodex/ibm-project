import { WATSON_MODELS } from '@/constants/watsonModels';

export interface TextGenerationParams {
  input: string;
  modelId: keyof typeof WATSON_MODELS;
  systemPrompt?: string;
  projectId: string;
  parameters: {
    max_new_tokens: number;
  };
}

export interface WatsonxResponse {
  generated_text: string;
}