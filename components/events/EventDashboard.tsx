
import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../services/api';
import { Event, EventFilter } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import EventList from './EventList';
import Button from '../shared/Button';
import EventFormModal from './EventFormModal';
import ConfirmationModal from '../shared/ConfirmationModal';
import { PlusIcon, CalendarIcon } from '../icons/Icons';

const EventDashboard: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<EventFilter>(EventFilter.ALL);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedEvents = await api.getEvents();
            setEvents(fetchedEvents);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleCreateEvent = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    }
    
    const handleRequestDelete = (event: Event) => {
        setEventToDelete(event);
    };
    
    const handleConfirmDelete = async () => {
        if (!eventToDelete) return;

        setIsDeleting(true);
        try {
            await api.deleteEvent(eventToDelete.id);
            setEventToDelete(null);
            fetchEvents(); // Refresh list
        } catch (error) {
            console.error("Failed to delete event", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const handleSuccess = () => {
        handleCloseModal();
        fetchEvents(); // Refresh list after success
    };
    
    const filteredEvents = events.filter(event => {
        if (!user) return true;
        switch (filter) {
            case EventFilter.ATTENDING:
                return event.attendees.includes(user.id);
            case EventFilter.ORGANIZED:
                return event.organizer.id === user.id;
            case EventFilter.ALL:
            default:
                return true;
        }
    });

    const getFilterCount = (filterType: EventFilter) => {
        if (!user) return 0;
        return events.filter(event => {
             switch (filterType) {
                case EventFilter.ATTENDING:
                    return event.attendees.includes(user.id);
                case EventFilter.ORGANIZED:
                    return event.organizer.id === user.id;
                 case EventFilter.ALL:
                 default:
                    return true;
            }
        }).length;
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="md:flex md:items-center md:justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                            <CalendarIcon className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
                            <div>
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
                                    Eventos en Gijón
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Descubre y participa en eventos locales</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <Button onClick={handleCreateEvent}>
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Crear Evento
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {Object.values(EventFilter).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`${
                                        filter === tab
                                            ? 'border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                >
                                    {tab} ({getFilterCount(tab)})
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <EventList 
                    events={filteredEvents} 
                    loading={loading} 
                    onEdit={handleEditEvent}
                    onRequestDelete={handleRequestDelete}
                    onJoinLeave={fetchEvents}
                />
            </div>
            <EventFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                event={editingEvent}
            />
            <ConfirmationModal
                isOpen={!!eventToDelete}
                onClose={() => setEventToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                confirmButtonText="Eliminar"
                loading={isDeleting}
            >
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    ¿Estás seguro de que quieres eliminar el evento 
                    <span className="font-semibold text-gray-800 dark:text-gray-100"> "{eventToDelete?.title}"</span>?
                    Esta acción no se puede deshacer.
                </p>
            </ConfirmationModal>
        </>
    );
};

export default EventDashboard;