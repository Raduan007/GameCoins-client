import { NextResponse } from "next/server";
import apiResponse from "./api-response";

/**
 * Centralized error handler for API routes.
 * Catches known and unknown errors and returns a standardized API response.
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return apiResponse.error(error.message, error.status);
  }

  if (error instanceof Error) {
    const message =
      process.env.NODE_ENV === "development"
        ? error.message
        : "An unexpected error occurred";
    return apiResponse.error(message, 500);
  }

  return apiResponse.error("An unexpected error occurred", 500);
}

/**
 * Custom error class for API errors with status codes.
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Common API errors factory.
 */
export const ApiErrors = {
  notFound: (resource = "Resource") => new ApiError(`${resource} not found`, 404),
  badRequest: (message: string) => new ApiError(message, 400),
  unauthorized: (message = "Unauthorized") => new ApiError(message, 401),
  forbidden: (message = "Forbidden") => new ApiError(message, 403),
  internal: (message = "Internal server error") => new ApiError(message, 500),
};