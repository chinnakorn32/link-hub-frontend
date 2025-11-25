import apiClient from './api.service';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth.types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Authentication service
 */
class AuthService {
    /**
     * Login user
     */
    async login(request: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', request);
        if (response.data.token) {
            this.setToken(response.data.token);
            this.setUser({
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                role: response.data.role,
            });
        }
        return response.data;
    }

    /**
     * Register new user
     */
    async register(request: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/api/auth/register', request);
        if (response.data.token) {
            this.setToken(response.data.token);
            this.setUser({
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                role: response.data.role,
            });
        }
        return response.data;
    }

    /**
     * Logout user
     */
    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    /**
     * Get stored token
     */
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    /**
     * Set token in storage
     */
    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    /**
     * Get current user from storage
     */
    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Set user in storage
     */
    setUser(user: User): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export default new AuthService();
