
import React from 'react';
import { Event } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Button from '../shared/Button';
import * as api from '../../services/api';
import { CalendarIcon, LocationMarkerIcon, UsersIcon, PencilIcon, TrashIcon } from '../icons/Icons';

interface EventCardProps {
    event: Event;
    onEdit: (event: Event) => void;
    onDelete: () => void;
    onJoinLeave: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete, onJoinLeave }) => {
    const { user } = useAuth();
    const isOrganizer = user?.id === event.organizer.id;
    const isAttending = user ? event.attendees.includes(user.id) : false;
    const isFull = event.attendees.length >= event.maxAttendees;

    const handleJoin = async () => {
        if (!user) return;
        await api.joinEvent(event.id, user.id);
        onJoinLeave();
    };

    const handleLeave = async () => {
        if (!user) return;
        await api.leaveEvent(event.id, user.id);
        onJoinLeave();
    };
    
    const handleDelete = async () => {
        if (window.confirm(`¿Seguro que quieres eliminar el evento "${event.title}"?`)) {
            await api.deleteEvent(event.id);
            onDelete();
        }
    }

    const formattedDate = new Date(event.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
            <div className="p-6 flex-grow">
                <p className="text-sm text-gray-500">Organizado por {event.organizer.name}</p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">{event.title}</h3>
                <p className="mt-2 text-gray-600 text-sm line-clamp-3">{event.description}</p>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center">
                        <LocationMarkerIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                        <UsersIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{event.attendees.length}/{event.maxAttendees} personas</span>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
                {isOrganizer ? (
                    <div className="flex space-x-3">
                        <Button onClick={() => onEdit(event)} variant="secondary" size="sm" fullWidth>
                           <PencilIcon className="w-4 h-4 mr-2"/> Editar
                        </Button>
                        <Button onClick={handleDelete} variant="danger-outline" size="sm" fullWidth>
                           <TrashIcon className="w-4 h-4 mr-2"/> Eliminar
                        </Button>
                    </div>
                ) : isAttending ? (
                    <Button onClick={handleLeave} variant="secondary" fullWidth>
                        Ya estás unido (Salir)
                    </Button>
                ) : (
                    <Button onClick={handleJoin} disabled={isFull} fullWidth>
                        {isFull ? 'Completo' : 'Unirse al Evento'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default EventCard;
