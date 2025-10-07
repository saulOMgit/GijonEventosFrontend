
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Bienvenido</h2>
                <p className="text-gray-500 mt-1">Inicia sesión o crea una cuenta para gestionar tus eventos</p>
            </div>

            <div className="mt-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
                            isLogin ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
                            !isLogin ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:bg-gray-200'
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
