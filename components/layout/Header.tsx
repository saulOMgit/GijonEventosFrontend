
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../icons/Logo';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2">
                        <Logo className="h-8 w-auto text-primary-600"/>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                           <div className="text-sm font-medium text-gray-800">{user?.name}</div>
                           <div className="text-xs text-gray-500">{user?.email}</div>
                        </div>
                        <button 
                            onClick={logout}
                            className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
                            title="Salir"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
