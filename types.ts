export interface User {
    id: string;
    name: string; // Mapeamos fullName del backend a name
    username: string;
    email: string;
    phone: string;
    role: string; // 'ROLE_ADMIN' | 'ROLE_USER'
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string; // Recibe YYYY-MM-DDTHH:MM:SS, se formatea a DD-MM-YYYY HH:MM en UI
    location: string;
    organizer: User;
    attendees: string[];
    maxAttendees: number;
}

export interface NewEventData {
    title: string;
    description: string;
    date: string; // Envía YYYY-MM-DDTHH:MM:SS
    location: string;
    maxAttendees: number;
}

export enum EventFilter {
    ALL = 'Todos',
    ATTENDING = 'Mis Asistencias',
    ORGANIZED = 'Organizados',
}

export interface RegisterData {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string; // Añadido para coincidir con RegisterDTORequest
}