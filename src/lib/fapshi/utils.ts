import { z } from 'zod';
import { FapshiResponse } from './types';

// Environment variables
export const baseUrl = process.env.FAPSHI_BASE_URL || 'https://sandbox.fapshi.com';
export const headers: HeadersInit = {
  'Content-Type': 'application/json',
  ...(process.env.FAPSHI_API_USER && { apiuser: process.env.FAPSHI_API_USER }),
  ...(process.env.FAPSHI_API_KEY && { apikey: process.env.FAPSHI_API_KEY }),
};

// Error handling helper
export async function handleFetchResponse<T>(response: Response): Promise<FapshiResponse<T>> {
  if (!response.ok) {
    let errorMessage = `Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If we can't parse the error as JSON, use the default message
      console.error('Error parsing error response:', e);
    }

    return {
      success: false,
      statusCode: response.status,
      message: errorMessage,
    };
  }

  const data = await response.json();
  return {
    success: true,
    statusCode: response.status,
    message: data.message || 'Operation successful',
    data,
  };
}

// Error handling helper
export function handleError<T>(error: unknown): FapshiResponse<T> {
  if (error instanceof z.ZodError) {
    return {
      success: false,
      statusCode: 400,
      message: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
    };
  }

  return {
    success: false,
    statusCode: 500,
    message: error instanceof Error ? error.message : 'Unknown error occurred',
  };
}
