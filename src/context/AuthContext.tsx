import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import { message } from 'antd';
import { User, LoginRequest, RegisterRequest } from '../types/auth.types';
import authService from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (request: LoginRequest) => Promise<void>;
    register: (request: RegisterRequest) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const currentUser = authService.getCurrentUser();
        if (currentUser && authService.isAuthenticated()) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (request: LoginRequest) => {
        try {
            const response = await authService.login(request);
            setUser({
                id: response.id,
                username: response.username,
                email: response.email,
                role: response.role,
            });
        } catch (error: any) {
            // message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
            throw error;
        }
    };

    const register = async (request: RegisterRequest) => {
        try {
            const response = await authService.register(request);
            setUser({
                id: response.id,
                username: response.username,
                email: response.email,
                role: response.role,
            });
        } catch (error: any) {
            // message.error(error.response?.data?.message || 'Registration failed. Please try again.');
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user && authService.isAuthenticated(),
        login,
        register,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
