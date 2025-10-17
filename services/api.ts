import { User, Event, NewEventData, RegisterData } from '../types';

// --- MOCK DATABASE ---
let users: (User & { passwordHash: string })[] = [
    { id: '1', name: 'Admin User', email: 'admin@email.com', passwordHash: 'password123' },
    { id: '2', name: 'María González', email: 'maria@email.com', passwordHash: 'password123' },
    { id: '3', name: 'Club Atletismo Asturias', email: 'club@email.com', passwordHash: 'password123' },
    { id: '4', name: 'Asociación de Restaurantes', email: 'restaurantes@email.com', passwordHash: 'password123' }
];

let events: Event[] = [
    {
        id: 'evt1',
        title: 'Concierto de Jazz en el Puerto',
        description: 'Disfruta de una velada de jazz con vistas al mar. Artistas locales e internacionales.',
        date: '2025-11-15T21:00:00',
        location: 'Puerto Deportivo de Gijón',
        organizer: { id: '2', name: 'María González', email: 'maria@email.com' },
        attendees: ['1', '3'],
        maxAttendees: 150,
    },
    {
        id: 'evt2',
        title: 'Maratón de Gijón 2025',
        description: 'Carrera anual por las calles de Gijón. Incluye categorías de 5K, 10K y maratón completa.',
        date: '2025-11-20T09:00:00',
        location: 'Plaza Mayor - Salida',
        organizer: { id: '3', name: 'Club Atletismo Asturias', email: 'club@email.com' },
        attendees: ['1', '2', '4'],
        maxAttendees: 500,
    },
    {
        id: 'evt3',
        title: 'Festival de Gastronomía Asturiana',
        description: 'Degustación de productos locales, sidra y platos típicos de la región.',
        date: '2025-10-25T12:00:00',
        location: 'Parque de Begoña',
        organizer: { id: '4', name: 'Asociación de Restaurantes', email: 'restaurantes@email.com' },
        attendees: [],
        maxAttendees: 300,
    },
];
// --- END MOCK DATABASE ---

const simulateNetwork = (delay = 500) => new Promise(res => setTimeout(res, delay));

// --- AUTH ---
export const login = async (username: string, password: string): Promise<User> => {
    const headers = new Headers();
    // La autenticación HTTP Basic envía las credenciales en la cabecera 'Authorization'
    headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));

    const response = await fetch('http://localhost:8080/api/v1/login', {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        if (response.status === 401) { // 401 Unauthorized es el error estándar para credenciales incorrectas
            throw new Error('Usuario o contraseña incorrectos.');
        }
        
        let errorMessage = 'Error en el inicio de sesión.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    const responseData = await response.json();

    if (!responseData.id || !responseData.fullName || !responseData.email) {
        throw new Error("Respuesta de login inválida del servidor.");
    }
    
    // Asumimos que el backend devuelve los datos del usuario al hacer login correctamente
    const loggedInUser: User = {
        id: responseData.id,
        name: responseData.fullName,
        email: responseData.email,
    };

    return loggedInUser;
};

export const register = async (data: RegisterData): Promise<User> => {
    const payload = {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.password,
    };

    const response = await fetch('http://localhost:8080/api/v1/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        let errorMessage = 'Error en el registro.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    const responseData = await response.json();

    if (!responseData.id || !responseData.fullName || !responseData.email) {
        throw new Error("Respuesta de registro inválida del servidor.");
    }

    const newUser: User = {
        id: responseData.id,
        name: responseData.fullName,
        email: responseData.email,
    };

    return newUser;
};


// --- EVENTS ---
export const getEvents = async (): Promise<Event[]> => {
    await simulateNetwork();
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const createEvent = async (eventData: NewEventData, organizer: User): Promise<Event> => {
    await simulateNetwork(1000);
    const newEvent: Event = {
        id: `evt${Date.now()}`,
        ...eventData,
        organizer,
        attendees: [],
    };
    events.push(newEvent);
    return newEvent;
};

export const updateEvent = async (eventId: string, eventData: NewEventData): Promise<Event> => {
    await simulateNetwork(1000);
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) throw new Error('Evento no encontrado.');
    const updatedEvent = { ...events[eventIndex], ...eventData };
    events[eventIndex] = updatedEvent;
    return updatedEvent;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    await simulateNetwork();
    events = events.filter(e => e.id !== eventId);
};

export const joinEvent = async (eventId: string, userId: string): Promise<void> => {
    await simulateNetwork();
    const event = events.find(e => e.id === eventId);
    if (event && !event.attendees.includes(userId)) {
        event.attendees.push(userId);
    }
};

export const leaveEvent = async (eventId: string, userId: string): Promise<void> => {
    await simulateNetwork();
    const event = events.find(e => e.id === eventId);
    if (event) {
        event.attendees = event.attendees.filter(id => id !== userId);
    }
};