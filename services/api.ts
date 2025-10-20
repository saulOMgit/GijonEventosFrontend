import { User, Event, NewEventData, RegisterData, EventFilter } from '../types';

// Base URL del backend
const API_URL = 'http://localhost:8080/api/v1';

// Función auxiliar para codificar credenciales en Base64
const encodeCredentials = (username: string, password: string) =>
    btoa(`${username}:${password}`);

// Función auxiliar para manejar errores de la API
const handleApiError = async (response: Response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Error ${response.status}: ${response.statusText}`);
    }
    return response;
};

// --- AUTH ---
export const login = async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${encodeCredentials(username, password)}`,
            'Content-Type': 'application/json',
        },
    });
    await handleApiError(response);
    const data = await response.json();
    return {
        id: data.id,
        name: data.fullName, // Mapeamos fullName a name
        username: data.username,
        email: data.email,
        phone: data.phone,
        role: data.role,
    };
};

export const register = async (data: RegisterData): Promise<User> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fullName: data.fullName,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: data.password,
            confirmPassword: data.confirmPassword, // Añadido
        }),
    });
    await handleApiError(response);
    const responseData = await response.json();
    return {
        id: responseData.id,
        name: responseData.fullName, // Mapeamos fullName a name
        username: responseData.username,
        email: responseData.email,
        phone: responseData.phone,
        role: 'ROLE_USER', // RegisterDTOResponse no incluye role, asignamos por defecto
    };
};

// --- EVENTS ---
export const getEvents = async (filter: EventFilter = EventFilter.ALL, userId: string): Promise<Event[]> => {
    const backendFilter = {
        [EventFilter.ALL]: 'ALL',
        [EventFilter.ATTENDING]: 'ATTENDING',
        [EventFilter.ORGANIZED]: 'ORGANIZED',
    }[filter];
    const response = await fetch(`${API_URL}/events?filter=${backendFilter}&userId=${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${encodeCredentials('daisy', 'password')}`, // Reemplazar con credenciales del usuario logueado
            'Content-Type': 'application/json',
        },
    });
    await handleApiError(response);
    const data = await response.json();
    return data.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        organizer: {
            id: event.organizer.id,
            name: event.organizer.fullName, // Mapeamos fullName a name
            username: event.organizer.username,
            email: event.organizer.email,
            phone: event.organizer.phone,
            role: event.organizer.role || '',
        },
        attendees: event.attendees.map((user: any) => user.id),
        maxAttendees: event.maxAttendees,
    }));
};

export const createEvent = async (eventData: NewEventData, organizerId: string): Promise<Event> => {
    const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encodeCredentials('daisy', 'password')}`, // Reemplazar con credenciales del usuario logueado
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            location: eventData.location,
            maxAttendees: eventData.maxAttendees,
            organizerId,
        }),
    });
    await handleApiError(response);
    const data = await response.json();
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        organizer: {
            id: data.organizer.id,
            name: data.organizer.fullName, // Mapeamos fullName a name
            username: data.organizer.username,
            email: data.organizer.email,
            phone: data.organizer.phone,
            role: data.organizer.role || '',
        },
        attendees: data.attendees.map((user: any) => user.id),
        maxAttendees: data.maxAttendees,
    };
};

export const updateEvent = async (eventId: string, eventData: NewEventData): Promise<Event> => {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Basic ${encodeCredentials('daisy', 'password')}`, // Reemplazar con credenciales del usuario logueado
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });
    await handleApiError(response);
    const data = await response.json();
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        organizer: {
            id: data.organizer.id,
            name: data.organizer.fullName, // Mapeamos fullName a name
            username: data.organizer.username,
            email: data.organizer.email,
            phone: data.organizer.phone,
            role: data.organizer.role || '',
        },
        attendees: data.attendees.map((user: any) => user.id),
        maxAttendees: data.maxAttendees,
    };
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Basic ${encodeCredentials('daisy', 'password')}`, // Reemplazar con credenciales del usuario logueado
            'Content-Type': 'application/json',
        },
    });
    await handleApiError(response);
};

export const joinEvent = async (eventId: string, userId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/events/${eventId}/attendees/${userId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encodeCredentials('daisy', 'password')}`, // Reemplazar con credenciales del usuario logueado
            'Content-Type': 'application/json',
        },
    });
    await handleApiError(response);
};

export const leaveEvent = async (eventId: string, userId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/events/${eventId}/attendees/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Basic ${encodeCredentials('daisy', 'password')}`, // Reemplazar con credenciales del usuario logueado
            'Content-Type': 'application/json',
        },
    });
    await handleApiError(response);
};

// --- MOCK DATABASE (para pruebas locales, sin daisy/donald) ---
const mockUsers: (User & { passwordHash: string })[] = [
    {
        id: '1',
        name: 'Test Admin',
        username: 'testadmin',
        email: 'testadmin@example.com',
        phone: '123456789',
        role: 'ROLE_ADMIN',
        passwordHash: 'testpassword',
    },
    {
        id: '2',
        name: 'Test User',
        username: 'testuser',
        email: 'testuser@example.com',
        phone: '987654321',
        role: 'ROLE_USER',
        passwordHash: 'testpassword',
    },
];

let mockEvents: Event[] = [
    {
        id: 'evt1',
        title: 'Test Concert',
        description: 'A test concert event.',
        date: '2025-11-15T21:00:00',
        location: 'Test Venue',
        organizer: {
            id: '1',
            name: 'Test Admin',
            username: 'testadmin',
            email: 'testadmin@example.com',
            phone: '123456789',
            role: 'ROLE_ADMIN',
        },
        attendees: ['2'],
        maxAttendees: 100,
    },
];

// Mock functions (para pruebas locales, descomentar si el backend no está disponible)
/*
export const login = async (username: string, password: string): Promise<User> => {
    await new Promise(res => setTimeout(res, 500));
    const user = mockUsers.find(u => u.username === username && u.passwordHash === password);
    if (!user) throw new Error('Credenciales inválidas.');
    return { id: user.id, name: user.name, username: user.username, email: user.email, phone: user.phone, role: user.role };
};

export const getEvents = async (filter: EventFilter = EventFilter.ALL, userId: string): Promise<Event[]> => {
    await new Promise(res => setTimeout(res, 500));
    let filteredEvents = mockEvents;
    if (filter === EventFilter.ATTENDING) {
        filteredEvents = mockEvents.filter(event => event.attendees.includes(userId));
    } else if (filter === EventFilter.ORGANIZED) {
        filteredEvents = mockEvents.filter(event => event.organizer.id === userId);
    }
    return [...filteredEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
*/