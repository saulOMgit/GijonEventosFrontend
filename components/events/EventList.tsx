
import React from 'react';
import { Event } from '../../types';
import EventCard from './EventCard';
import Spinner from '../shared/Spinner';

interface EventListProps {
    events: Event[];
    loading: boolean;
    onEdit: (event: Event) => void;
    onDelete: () => void;
    onJoinLeave: () => void;
}

const EventList: React.FC<EventListProps> = ({ events, loading, onEdit, onDelete, onJoinLeave }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-900">No se encontraron eventos</h3>
                <p className="mt-1 text-sm text-gray-500">Prueba a cambiar de filtro o crea un nuevo evento.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
                <EventCard 
                    key={event.id} 
                    event={event} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                    onJoinLeave={onJoinLeave} 
                />
            ))}
        </div>
    );
};

export default EventList;
