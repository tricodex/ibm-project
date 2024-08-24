import { WatsonXAI } from '@ibm-cloud/watsonx-ai';

export const watsonxAIService = WatsonXAI.newInstance({
  version: '2024-05-31',
  serviceUrl: 'https://us-south.ml.cloud.ibm.com',
});