
import React from 'react';
import { useAuth } from './hooks/useAuth';
import Auth from './components/auth/Auth';
import EventDashboard from './components/events/EventDashboard';
import Header from './components/layout/Header';
import Logo from './components/icons/Logo';

const App: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center mb-8">
                    <Logo className="h-12 w-auto mx-auto text-primary-600" />
                    <h1 className="mt-4 text-2xl font-semibold text-gray-700">Gestión de Eventos</h1>
                </div>
                <Auth />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main>
                <EventDashboard />
            </main>
        </div>
    );
};

export default App;
