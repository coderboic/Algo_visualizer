import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface GoogleAuthRequest {
  googleId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

class AuthService {
  private accessToken: string | null = localStorage.getItem('accessToken');
  private refreshToken: string | null = localStorage.getItem('refreshToken');

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    const { accessToken, refreshToken } = response.data.data;

    this.setTokens(accessToken, refreshToken);
    return response.data.data;
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    const { accessToken, refreshToken } = response.data.data;

    this.setTokens(accessToken, refreshToken);
    return response.data.data;
  }

  /**
   * Google authentication
   */
  async googleAuth(data: GoogleAuthRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/google`, data);
    const { accessToken, refreshToken } = response.data.data;

    this.setTokens(accessToken, refreshToken);
    return response.data.data;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    return response.data.data;
  }

  /**
   * Verify token
   */
  async verifyToken(): Promise<boolean> {
    try {
      await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken: this.refreshToken,
    });
    const { accessToken, refreshToken } = response.data.data;

    this.setTokens(accessToken, refreshToken);
    return response.data.data;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {
        refreshToken: this.refreshToken,
      });
    } catch (err) {
      // Even if logout fails on backend, clear local tokens
      console.warn('Logout failed on backend, clearing local tokens', err);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Set tokens in local storage
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Clear tokens from local storage
   */
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const authService = new AuthService();
