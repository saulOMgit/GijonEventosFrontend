import { User, Event, NewEventData, RegisterData, EventFilter } from '../types';

// Base URL del backend
const API_URL = 'http://localhost:8080/api/v1';

// Función auxiliar para codificar credenciales en Base64
const encodeCredentials = (username: string, password: string) =>
    btoa(`${username}:${password}`);

// Función para obtener las credenciales del sessionStorage
const getCredentials = (): { username: string; password: string } | null => {
    try {
        const storedCreds = sessionStorage.getItem('credentials');
        return storedCreds ? JSON.parse(storedCreds) : null;
    } catch {
        return null;
    }
};

// Función auxiliar para obtener headers con autenticación
const getAuthHeaders = (): HeadersInit => {
    const creds = getCredentials();
    if (!creds) {
        throw new Error('No hay credenciales disponibles. Por favor, inicia sesión.');
    }
    return {
        'Authorization': `Basic ${encodeCredentials(creds.username, creds.password)}`,
        'Content-Type': 'application/json',
    };
};

// Función auxiliar para manejar errores de la API
const handleApiError = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Error 401: El nombre de usuario o la contraseña no son correctos. Por favor, verifica tus credenciales e inténtalo de nuevo.');
        }
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
        name: data.fullName,
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
            confirmPassword: data.confirmPassword,
        }),
    });
    await handleApiError(response);
    const responseData = await response.json();
    return {
        id: responseData.id,
        name: responseData.fullName,
        username: responseData.username,
        email: responseData.email,
        phone: responseData.phone,
        role: 'ROLE_USER',
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
        headers: getAuthHeaders(),
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
            name: event.organizer.fullName,
            username: event.organizer.username,
            email: event.organizer.email,
            phone: event.organizer.phone,
            role: event.organizer.role || '',
        },
        attendees: event.attendees, // Backend devuelve array de IDs directamente
        maxAttendees: event.maxAttendees,
    }));
};

export const createEvent = async (eventData: NewEventData, organizerId: string): Promise<Event> => {
    const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
            name: data.organizer.fullName,
            username: data.organizer.username,
            email: data.organizer.email,
            phone: data.organizer.phone,
            role: data.organizer.role || '',
        },
        attendees: data.attendees, // Backend devuelve array de IDs directamente
        maxAttendees: data.maxAttendees,
    };
};

export const updateEvent = async (eventId: string, eventData: NewEventData): Promise<Event> => {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
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
            name: data.organizer.fullName,
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
        headers: getAuthHeaders(),
    });
    await handleApiError(response);
};

export const joinEvent = async (eventId: string, userId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/events/${eventId}/join`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    await handleApiError(response);
};

export const leaveEvent = async (eventId: string, userId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/events/${eventId}/leave`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    await handleApiError(response);
};
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