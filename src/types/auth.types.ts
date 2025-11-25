/**
 * User interface
 */
export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

/**
 * Login request interface
 */
export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

/**
 * Register request interface
 */
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
    token: string;
    type: string;
    id: string;
    username: string;
    email: string;
    role: string;
}
