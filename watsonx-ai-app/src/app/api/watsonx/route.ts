// src/app/api/watsonx/route.ts
import { NextResponse } from 'next/server';
import { watsonxAIService } from '@/lib/watsonx';
import { TextGenerationParams } from '@/types/watsonx';
import { WATSON_MODELS } from '@/constants/watsonModels';

export async function POST(request: Request) {
  const body: TextGenerationParams = await request.json();

  try {
    const response = await watsonxAIService.generateText({
      ...body,
      modelId: WATSON_MODELS[body.modelId],
      projectId: process.env.WATSONX_AI_PROJECT_ID,
    });

    return NextResponse.json(response.result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}