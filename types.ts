
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    organizer: User;
    attendees: string[];
    maxAttendees: number;
}

export interface NewEventData {
    title: string;
    description: string;
    date: string;
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
}
