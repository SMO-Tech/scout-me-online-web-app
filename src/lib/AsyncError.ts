import { AxiosError } from "axios";

/**
 * A simple utility to extract a clean error message from an async/API failure.
 */
export const catchAsyncError = (err: any): string => {
  // If it's an Axios error, try to get the message from the server response
  if (err instanceof AxiosError) {
    return err.response?.data?.error || err.response?.data?.message || err.message;
  }

  // If it's a standard JS error
  if (err instanceof Error) {
    return err.message;
  }

  // Fallback for strings or unknown objects
  return "An unknown error occurred";
};