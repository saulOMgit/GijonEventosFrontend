import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, RegisterData } from '../types';
import * as api from '../services/api';

interface AuthContextType {
    user: User | null;
    login: (username: string, pass: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleApiError = (err: any) => {
        if (err instanceof TypeError && err.message === 'Failed to fetch') {
            setError('No se pudo conectar con el servidor. Verifica que el backend esté funcionando y la configuración de CORS sea correcta.');
        } else {
            setError(err.message);
        }
        throw err;
    };

    const login = useCallback(async (username: string, pass: string) => {
        setLoading(true);
        setError(null);
        try {
            const loggedInUser = await api.login(username, pass);
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
        } catch (err: any) {
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        setLoading(true);
        setError(null);
        try {
            const newUser = await api.register(data);
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        } catch (err: any) {
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};