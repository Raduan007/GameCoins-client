const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiError {
  success: false;
  error: string;
  status: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Common request wrapper to automatically attach JWT token and handle errors
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // Debug: confirm the API base URL is resolved at runtime
  console.log("[API] NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

  if (!API_URL) {
    throw new Error(
      "API URL is missing. Make sure NEXT_PUBLIC_API_URL is set in .env.local (e.g. http://localhost:5000)"
    );
  }

  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${baseUrl}${cleanPath}`;

  // Debug: log every outgoing request URL
  console.log(`[API] ${(options.method || 'GET').toUpperCase()} ${fullUrl}`);

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (typeof window !== 'undefined' && !headers.has('Authorization')) {
    const token = localStorage.getItem('gamecoins_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Wrap in try/catch to intercept network-level failures (server down, CORS
  // preflight blocked, no connectivity). Without this, the browser throws a raw
  // "TypeError: Failed to fetch" with no context about which URL failed or why.
  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers,
    });
  } catch (networkError) {
    const reason = networkError instanceof Error ? networkError.message : String(networkError);
    throw new Error(
      `Network error — could not reach the API server.\n` +
      `  URL: ${fullUrl}\n` +
      `  Reason: ${reason}\n` +
      `  Fix: Make sure the backend is running → cd GameCoins-Server && npm run dev`
    );
  }

  // Expired or invalid tokens trigger global logout event
  // Skip for auth endpoints — a failed login/register should NOT trigger a logout
  const isAuthEndpoint = cleanPath === '/api/auth/login' || cleanPath === '/api/auth/register';
  if ((response.status === 401 || response.status === 403) && !isAuthEndpoint) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gamecoins_token');
      localStorage.removeItem('gamecoins_user');
      window.dispatchEvent(new Event('gamecoins-logout'));
    }
    
    let errorMessage = 'Session expired';
    try {
      const errorData = (await response.clone().json()) as ApiError;
      errorMessage = errorData.error || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  // For auth endpoints that return 401/403, still surface the error cleanly
  if ((response.status === 401 || response.status === 403) && isAuthEndpoint) {
    let errorMessage = 'Invalid credentials';
    try {
      const errorData = (await response.json()) as ApiError;
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = (await response.json()) as ApiError;
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const result = (await response.json()) as ApiResponse<T>;
  return result.data;
}

export const api = {
  get<T>(path: string, options?: RequestInit): Promise<T> {
    return request<T>(path, { ...options, method: 'GET' });
  },
  post<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },
  put<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },
  patch<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },
  delete<T>(path: string, options?: RequestInit): Promise<T> {
    return request<T>(path, { ...options, method: 'DELETE' });
  },
};
