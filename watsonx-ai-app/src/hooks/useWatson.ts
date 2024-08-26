import { useState } from 'react'
import { TextGenerationParams, WatsonxResponse } from '@/types/watsonx'
import { WatsonModelId } from '@/constants/watsonModels'

// Custom hook for interacting with Watson API
export const useWatson = () => {
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false)

  console.debug('useWatson hook initialized with isLoading:', isLoading)

  // Helper function to check if all required environment variables are available
  const checkEnvVariables = () => {
    const requiredEnvVars = ['NEXT_PUBLIC_WATSONX_AI_PROJECT_ID']
    requiredEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        console.debug(`${envVar} is present: ${process.env[envVar]}`)
      } else {
        console.warn(`${envVar} is missing`)
      }
    })
  }

  // Function to generate text using Watson API
  const generateText = async (params: TextGenerationParams): Promise<WatsonxResponse | null> => {
    console.debug('generateText called with params:', params)
    setIsLoading(true)
    console.debug('isLoading set to true')

    try {
      // Ensure environment variables are checked before making the API request
      checkEnvVariables()

      console.debug('Sending request to /api/watsonx with body:', JSON.stringify(params))
      const response = await fetch('/api/watsonx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        next: { revalidate: 0 }, // Disable caching for this request
      })

      console.debug('Received response from /api/watsonx:', response)

      if (!response.ok) {
        console.error('Response not OK. Status:', response.status, 'StatusText:', response.statusText)
        throw new Error('Failed to generate text')
      }

      const data: WatsonxResponse = await response.json()
      console.debug('Response JSON parsed successfully:', data)
      return data
    } catch (error) {
      console.error('Error generating text:', error)
      return null
    } finally {
      console.debug('generateText finished, setting isLoading to false')
      setIsLoading(false)
      console.debug('isLoading set to false')
    }
  }

  // Function to generate code snippet
  const generateCodeSnippet = async (prompt: string, modelId: WatsonModelId = 'GRANITE_13B_CHAT_V2'): Promise<string> => {
    console.debug('generateCodeSnippet called with prompt:', prompt, 'and modelId:', modelId)

    const params: TextGenerationParams = {
      input: `Generate a code snippet for the following prompt: ${prompt}`,
      modelId,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 200,
      },
    }

    console.debug('Generated params for generateCodeSnippet:', params)
    const response = await generateText(params)
    console.debug('Response from generateText in generateCodeSnippet:', response)
    return response?.generated_text || ''
  }

  // Function to get code suggestions
  const getCodeSuggestions = async (query: string, modelId: WatsonModelId = 'GRANITE_13B_CHAT_V2'): Promise<string> => {
    console.debug('getCodeSuggestions called with query:', query, 'and modelId:', modelId)

    const params: TextGenerationParams = {
      input: `Provide code suggestions for the following query: ${query}`,
      modelId,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 150,
      },
    }

    console.debug('Generated params for getCodeSuggestions:', params)
    const response = await generateText(params)
    console.debug('Response from generateText in getCodeSuggestions:', response)
    return response?.generated_text || ''
  }

  // Function to generate project insights
  const generateProjectInsights = async (context: string, modelId: WatsonModelId = 'GRANITE_13B_CHAT_V2'): Promise<string> => {
    console.debug('generateProjectInsights called with context:', context, 'and modelId:', modelId)

    const params: TextGenerationParams = {
      input: `Given the following context about a coding project, provide insights and suggestions: ${context}`,
      modelId,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 200,
      },
    }

    console.debug('Generated params for generateProjectInsights:', params)
    const response = await generateText(params)
    console.debug('Response from generateText in generateProjectInsights:', response)
    return response?.generated_text || ''
  }

  // Function to generate task breakdown
  const generateTaskBreakdown = async (projectDescription: string, modelId: WatsonModelId = 'GRANITE_13B_CHAT_V2'): Promise<string> => {
    console.debug('generateTaskBreakdown called with description:', projectDescription, 'and modelId:', modelId)

    const params: TextGenerationParams = {
      input: `Given this project description, break it down into a list of tasks: ${projectDescription}`,
      modelId,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 300,
      },
    }

    console.debug('Generated params for generateTaskBreakdown:', params)
    const response = await generateText(params)
    console.debug('Response from generateText in generateTaskBreakdown:', response)
    return response?.generated_text || ''
  }

  // Function to estimate project duration
  const estimateProjectDuration = async (tasks: string[], modelId: WatsonModelId = 'GRANITE_13B_CHAT_V2'): Promise<string> => {
    console.debug('estimateProjectDuration called with tasks:', tasks, 'and modelId:', modelId)

    const params: TextGenerationParams = {
      input: `Given these project tasks, estimate the duration for each and provide a total project timeline: ${tasks.join(', ')}`,
      modelId,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 250,
      },
    }

    console.debug('Generated params for estimateProjectDuration:', params)
    const response = await generateText(params)
    console.debug('Response from generateText in estimateProjectDuration:', response)
    return response?.generated_text || ''
  }

  // Function to suggest tech stack
  const suggestTechStack = async (projectRequirements: string, modelId: WatsonModelId = 'GRANITE_13B_CHAT_V2'): Promise<string> => {
    console.debug('suggestTechStack called with requirements:', projectRequirements, 'and modelId:', modelId)

    const params: TextGenerationParams = {
      input: `Based on these project requirements, suggest an appropriate tech stack: ${projectRequirements}`,
      modelId,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 200,
      },
    }

    console.debug('Generated params for suggestTechStack:', params)
    const response = await generateText(params)
    console.debug('Response from generateText in suggestTechStack:', response)
    return response?.generated_text || ''
  }

  // Function to generate test cases
  const generateTestCases = async (functionality: string, modelId: WatsonModelId = 'GRANITE_13B_CHAT_V2'): Promise<string> => {
    console.debug('generateTestCases called with functionality:', functionality, 'and modelId:', modelId)

    const params: TextGenerationParams = {
      input: `Generate a list of test cases for this functionality: ${functionality}`,
      modelId,
      projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
      parameters: {
        max_new_tokens: 300,
      },
    }

    console.debug('Generated params for generateTestCases:', params)
    const response = await generateText(params)
    console.debug('Response from generateText in generateTestCases:', response)
    return response?.generated_text || ''
  }

  console.debug('useWatson hook is returning functions and state')

  // Return all functions and loading state
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
  }
}
