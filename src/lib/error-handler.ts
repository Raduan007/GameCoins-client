import { NextResponse } from "next/server";
import { Error as MongooseError } from "mongoose";
import apiResponse from "./api-response";

/**
 * Centralized error handler for API routes.
 * Catches known and unknown errors and returns a standardized API response.
 */
export function handleApiError(error: unknown): NextResponse {
  // Log all errors to the terminal during development
  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", error);
  }

  // Mongoose validation error — return 400 with field-level messages
  if (error instanceof MongooseError.ValidationError) {
    const messages = Object.values(error.errors).map((e) => e.message);
    return apiResponse.error(messages.join(", "), 400);
  }

  // MongoDB duplicate key error (race condition on unique fields)
  if (isMongoDuplicateError(error)) {
    const field = Object.keys(error.keyPattern || {}).join(", ");
    return apiResponse.error(`Duplicate value for: ${field}`, 409);
  }

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

function isMongoDuplicateError(
  error: unknown
): error is { code: number; keyPattern: Record<string, unknown> } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  );
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