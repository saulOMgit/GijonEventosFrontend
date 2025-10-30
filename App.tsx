
import React from 'react';
import { useAuth } from './hooks/useAuth';
import Auth from './components/auth/Auth';
import EventDashboard from './components/events/EventDashboard';
import Header from './components/layout/Header';
import Logo from './components/icons/Logo';
import Footer from './components/layout/Footer';

const App: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
                <div className="text-center mb-8">
                    <Logo className="h-12 w-auto mx-auto" />
                    {/* <h1 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">Gijón Eventos</h1> */}
                </div>
                <Auth />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-grow">
                <EventDashboard />
            </main>
            <Footer />
        </div>
    );
};

export default App;