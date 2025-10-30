
import React, { useState,useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../hooks/useAuth';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { clearError } = useAuth();

    useEffect(() => {
        clearError();
    }, [isLogin, clearError]);

    const handleTabChange = (isLoginTab: boolean) => {
        if (isLogin !== isLoginTab) {
            setIsLogin(isLoginTab);
        }
    };
    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Bienvenido</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Inicia sesión o crea una cuenta para gestionar tus eventos</p>
            </div>

            <div className="mt-6">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
                            isLogin ? 'bg-white dark:bg-gray-800 shadow text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => handleTabChange(false)}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
                            !isLogin ? 'bg-white dark:bg-gray-800 shadow text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        Registrarse
                    </button>
                </div>
            </div>

            <div className="mt-6">
                {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    );
};

export default Auth;