// src/hooks/useWatson.ts
import { useState } from 'react';
import { TextGenerationParams, WatsonxResponse } from '@/types/watsonx';
import { WATSON_MODELS, WatsonModelId } from '@/constants/watsonModels';

const DEFAULT_SYSTEM_PROMPTS = {
  codeGeneration: "You are an expert code generator. Your task is to write clean, efficient, and well-documented code based on the given requirements.",
  codeSuggestions: "You are a knowledgeable coding assistant. Provide helpful suggestions, best practices, and potential improvements for the given code or query.",
  projectInsights: "You are a seasoned project manager and developer. Analyze the given project context and provide valuable insights, potential risks, and improvement suggestions.",
  taskBreakdown: "You are a skilled project planner. Break down the given project description into a comprehensive list of tasks, considering all aspects of software development.",
  projectDuration: "You are an experienced project estimator. Analyze the given tasks and provide realistic time estimates for each, along with an overall project timeline.",
  techStack: "You are a technology consultant with broad knowledge of development tools and frameworks. Suggest the most appropriate tech stack based on the given project requirements.",
  testCases: "You are a quality assurance expert. Generate a comprehensive list of test cases for the given functionality, covering various scenarios and edge cases."
};

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
        body: JSON.stringify({
          ...params,
          input: `System:\n${params.systemPrompt}\n\nHuman: ${params.input}\n\nAssistant:`,
          parameters: {
            ...params.parameters,
            decoding_method: "greedy",
            max_new_tokens: Math.max(params.parameters.max_new_tokens || 0, 2048),
            min_new_tokens: 0,
            stop_sequences: ["\n\nHuman:", "\n\nSystem:"],
            repetition_penalty: 1.2,
            temperature: 0.7,
            top_p: 0.9,
            top_k: 50,
          },
        }),
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

  const generateCodeSnippet = async (
    prompt: string, 
    modelId: WatsonModelId = 'GRANITE_34B_CODE_INSTRUCT',
    systemPrompt: string = DEFAULT_SYSTEM_PROMPTS.codeGeneration
  ): Promise<string> => {
    const params: TextGenerationParams = {
      input: prompt,
      modelId,
      systemPrompt,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 2048,
      },
    };

    const response = await generateText(params);
    return response?.generated_text || '';
  };

  const getCodeSuggestions = async (
    query: string, 
    modelId: WatsonModelId = 'GRANITE_34B_CODE_INSTRUCT',
    systemPrompt: string = DEFAULT_SYSTEM_PROMPTS.codeSuggestions
  ): Promise<string> => {
    const params: TextGenerationParams = {
      input: query,
      modelId,
      systemPrompt,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 2048,
      },
    };

    const response = await generateText(params);
    return response?.generated_text || '';
  };

  const generateProjectInsights = async (
    context: string, 
    modelId: WatsonModelId = 'GRANITE_13B_INSTRUCT_V2',
    systemPrompt: string = DEFAULT_SYSTEM_PROMPTS.projectInsights
  ): Promise<string> => {
    const params: TextGenerationParams = {
      input: context,
      modelId,
      systemPrompt,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 2048,
      },
    };

    const response = await generateText(params);
    return response?.generated_text || '';
  };

  const generateTaskBreakdown = async (
    projectDescription: string, 
    modelId: WatsonModelId = 'GRANITE_13B_INSTRUCT_V2',
    systemPrompt: string = DEFAULT_SYSTEM_PROMPTS.taskBreakdown
  ): Promise<string> => {
    const params: TextGenerationParams = {
      input: projectDescription,
      modelId,
      systemPrompt,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 2048,
      },
    };

    const response = await generateText(params);
    return response?.generated_text || '';
  };

  const estimateProjectDuration = async (
    tasks: string[], 
    modelId: WatsonModelId = 'GRANITE_13B_INSTRUCT_V2',
    systemPrompt: string = DEFAULT_SYSTEM_PROMPTS.projectDuration
  ): Promise<string> => {
    const params: TextGenerationParams = {
      input: tasks.join(', '),
      modelId,
      systemPrompt,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 2048,
      },
    };

    const response = await generateText(params);
    return response?.generated_text || '';
  };

  const suggestTechStack = async (
    projectRequirements: string, 
    modelId: WatsonModelId = 'GRANITE_13B_INSTRUCT_V2',
    systemPrompt: string = DEFAULT_SYSTEM_PROMPTS.techStack
  ): Promise<string> => {
    const params: TextGenerationParams = {
      input: projectRequirements,
      modelId,
      systemPrompt,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 2048,
      },
    };

    const response = await generateText(params);
    return response?.generated_text || '';
  };

  const generateTestCases = async (
    functionality: string, 
    modelId: WatsonModelId = 'GRANITE_34B_CODE_INSTRUCT',
    systemPrompt: string = DEFAULT_SYSTEM_PROMPTS.testCases
  ): Promise<string> => {
    const params: TextGenerationParams = {
      input: functionality,
      modelId,
      systemPrompt,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 2048,
      },
    };

    const response = await generateText(params);
    return response?.generated_text || '';
  };

  return {
    generateText,
    generateCodeSnippet,
    getCodeSuggestions,
    generateProjectInsights,
    generateTaskBreakdown,
    estimateProjectDuration,
    suggestTechStack,
    generateTestCases,
    isLoading,
  };
};