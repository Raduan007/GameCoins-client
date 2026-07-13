import { api } from "./api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'seller';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(name: string, email: string, password: string): Promise<User> {
    return api.post<User>('/api/auth/register', { name, email, password });
  },

  /**
   * Log in an existing user
   */
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return api.post<{ token: string; user: User }>('/api/auth/login', { email, password });
  },

  /**
   * Get the current authenticated user's profile
   */
  async getCurrentUser(token: string): Promise<User> {
    // Explicitly pass token as headers if the context startup calls this
    // before token state is set or before API utility reads it from localStorage.
    return api.get<User>('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Log out the current user by removing token
   */
  logout(): void {
    localStorage.removeItem('gamecoins_token');
    localStorage.removeItem('gamecoins_user');
  },
};
