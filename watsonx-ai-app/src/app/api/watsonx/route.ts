import { NextResponse } from 'next/server';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { TextGenerationParams } from '@/types/watsonx';
import { WATSON_MODELS } from '@/constants/watsonModels';

// Initialize WatsonXAI service instance
const watsonxAIService = WatsonXAI.newInstance({
  version: '2024-05-31',
  serviceUrl: 'https://us-south.ml.cloud.ibm.com',
});

// Helper function to check if all required environment variables are available
const checkEnvVariables = () => {
  const requiredEnvVars = ['NEXT_PUBLIC_WATSONX_AI_PROJECT_ID'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('Missing environment variables:', missingEnvVars);
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  console.log('All required environment variables are present');
};

export async function POST(request: Request) {
  console.log('Request Method:', request.method);
  console.log('Request Headers:', JSON.stringify([...request.headers]));

  const body: TextGenerationParams = await request.json();
  console.log('Received Request Body:', body);

  try {
    // Ensure environment variables are checked before making the API request
    checkEnvVariables();

    // Prepare the request data
    const requestData = {
      input: body.input,
      modelId: WATSON_MODELS[body.modelId],
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: body.parameters,
    };

    console.log('Sending Request to WatsonX AI Service:', requestData);

    // Use the correct method to generate text based on SDK usage
    const response = await watsonxAIService.generateText(requestData);

    console.log('Received Response from WatsonX AI Service:', response);

    return NextResponse.json(response.result.results[0]);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
