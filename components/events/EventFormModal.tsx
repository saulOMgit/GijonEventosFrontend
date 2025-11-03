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
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Función para convertir datetime-local a formato del backend (YYYY-MM-DDTHH:MM:SS)
    const formatDateForBackend = (dateString: string): string => {
        // dateString viene en formato: "2025-10-20T14:50" (datetime-local)
        // El backend espera: "2025-10-20T14:50:00"
        return `${dateString}:00`;
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            const eventData: NewEventData = {
                ...data,
                date: formatDateForBackend(data.date), // Formato correcto para el backend
                maxAttendees: Number(data.maxAttendees)
            };
            if (event) {
                await api.updateEvent(event.id, eventData);
            } else {
                await api.createEvent(eventData, user.id); // Pasar solo el ID
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save event", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const inputClasses = "mt-1 block w-full px-3 py-2 border bg-gray-50 text-gray-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-500 dark:focus:ring-primary-400 dark:focus:border-primary-400";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Editar Evento' : 'Crear Nuevo Evento'}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="title" className={labelClasses}>Título del Evento</label>
                    <input id="title" {...register("title", { required: "El título es obligatorio" })} className={inputClasses}/>
                    {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>}
                </div>
                <div>
                    <label htmlFor="description" className={labelClasses}>Descripción</label>
                    <textarea id="description" {...register("description", { required: "La descripción es obligatoria" })} rows={3} className={inputClasses}/>
                    {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className={labelClasses}>Fecha y Hora</label>
                        <input id="date" type="datetime-local" {...register("date", { required: "La fecha es obligatoria", min: {value: getMinDate(), message: 'No se pueden crear eventos en el pasado'} })} className={`${inputClasses} [color-scheme:light] dark:[color-scheme:dark]`}/>
                        {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="location" className={labelClasses}>Ubicación</label>
                        <input id="location" {...register("location", { required: "La ubicación es obligatoria" })} className={inputClasses}/>
                        {errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.message}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="maxAttendees" className={labelClasses}>Máximo de Asistentes</label>
                    <input id="maxAttendees" type="number" {...register("maxAttendees", { required: "El número es obligatorio", valueAsNumber: true, min: { value: 1, message: "Debe ser al menos 1" } })} className={inputClasses}/>
                    {errors.maxAttendees && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maxAttendees.message}</p>}
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