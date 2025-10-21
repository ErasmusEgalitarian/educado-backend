// hooks/useApi.js
// eslint-disable @typescript-eslint/no-explicit-any

import { useState } from "react";

export interface ApiError extends Error {
  response?: {
    data?: {
      error?: {
        code?: string;
        message?: string; // Add message property for better error handling
      };
    };
  };
}

type ApiFunction<T, A> = (args: A) => Promise<T>;


export const useApi = <T, A>(apiFunc: (args: A) => Promise<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const call = async (args: A): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFunc(args);
      setIsLoading(false);
      return response;
    } catch (error) {
      setError(error as ApiError);
      setIsLoading(false);
      throw error;
    }
  };

  return { call, isLoading, error };
};
