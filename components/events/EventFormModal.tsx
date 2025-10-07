
import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Event, NewEventData } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import * as api from '../../services/api';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

interface EventFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    event: Event | null;
}

type Inputs = {
    title: string;
    description: string;
    date: string;
    location: string;
    maxAttendees: number;
};

const EventFormModal: React.FC<EventFormModalProps> = ({ isOpen, onClose, onSuccess, event }) => {
    const { user } = useAuth();
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<Inputs>();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    useEffect(() => {
        if (event) {
            reset({
                ...event,
                date: event.date.substring(0, 16), // Format for datetime-local
                maxAttendees: event.maxAttendees,
            });
        } else {
            reset({
                title: '',
                description: '',
                date: '',
                location: '',
                maxAttendees: 10,
            });
        }
    }, [event, reset, isOpen]);
    
    const getMinDate = () => {
        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        return today.toISOString().slice(0, 16);
    }


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            const eventData: NewEventData = {
                ...data,
                date: new Date(data.date).toISOString(),
                maxAttendees: Number(data.maxAttendees)
            };
            if (event) {
                await api.updateEvent(event.id, eventData);
            } else {
                await api.createEvent(eventData, user);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save event", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Editar Evento' : 'Crear Nuevo Evento'}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del Evento</label>
                    <input id="title" {...register("title", { required: "El título es obligatorio" })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea id="description" {...register("description", { required: "La descripción es obligatoria" })} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                        <input id="date" type="datetime-local" {...register("date", { required: "La fecha es obligatoria", min: {value: getMinDate(), message: 'No se pueden crear eventos en el pasado'} })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
                        <input id="location" {...register("location", { required: "La ubicación es obligatoria" })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">Máximo de Asistentes</label>
                    <input id="maxAttendees" type="number" {...register("maxAttendees", { required: "El número es obligatorio", valueAsNumber: true, min: { value: 1, message: "Debe ser al menos 1" } })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                    {errors.maxAttendees && <p className="mt-1 text-sm text-red-600">{errors.maxAttendees.message}</p>}
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" loading={isSubmitting}>{event ? 'Guardar Cambios' : 'Crear Evento'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default EventFormModal;
