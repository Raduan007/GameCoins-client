import { NextResponse } from "next/server";

interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  status: number;
}

type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

function success<T>(data: T, message?: string, status = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

function error(message: string, status = 500): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      status,
    },
    { status }
  );
}

const apiResponse = {
  success,
  error,
};

export default apiResponse;
export type { ApiResponse, ApiSuccessResponse, ApiErrorResponse };