/// <reference types="vitest/globals" />
// __tests__/EventCard.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventCard from '@/components/events/EventCard';
import { Event, User } from '@/types';
import * as api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

// Mock useAuth
vi.mock('@/hooks/useAuth');

// Mock api
vi.mock('@/services/api');

const mockUser: User = {
  id: '1',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  phone: '123456789',
  role: 'ROLE_USER',
};

const mockEvent: Event = {
  id: '1',
  title: 'Test Event',
  description: 'Short description',
  date: '2025-10-28T10:00:00',
  location: 'Test Location',
  organizer: mockUser,
  attendees: ['1'],
  maxAttendees: 5,
};

describe('EventCard', () => {
  const user = userEvent.setup();
  const mockOnEdit = vi.fn();
  const mockOnRequestDelete = vi.fn();
  const mockOnJoinLeave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock completo de useAuth
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      credentials: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loading: false,
      error: null,
    });

    // Mock de API
    vi.mocked(api.joinEvent).mockResolvedValue(undefined);
    vi.mocked(api.leaveEvent).mockResolvedValue(undefined);
  });

  it('renders event details correctly', () => {
    render(
      <EventCard
        event={mockEvent}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
    expect(screen.getByText(`${mockEvent.attendees.length}/${mockEvent.maxAttendees} personas`)).toBeInTheDocument();
  });

  it('renders edit and delete buttons for organizer', () => {
    render(
      <EventCard
        event={mockEvent}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    expect(screen.getByText(/editar/i)).toBeInTheDocument();
    expect(screen.getByText(/eliminar/i)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    render(
      <EventCard
        event={mockEvent}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    await user.click(screen.getByText(/editar/i));
    expect(mockOnEdit).toHaveBeenCalledWith(mockEvent);
  });

  it('calls onRequestDelete when delete button is clicked', async () => {
    render(
      <EventCard
        event={mockEvent}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    await user.click(screen.getByText(/eliminar/i));
    expect(mockOnRequestDelete).toHaveBeenCalledWith(mockEvent);
  });

  it('renders "Ya estás unido (Salir)" button for attending non-organizer', () => {
    const nonOrganizerEvent: Event = {
      ...mockEvent,
      organizer: { ...mockUser, id: '2' },
    };
    render(
      <EventCard
        event={nonOrganizerEvent}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    expect(screen.getByText(/ya estás unido \(salir\)/i)).toBeInTheDocument();
  });

  it('calls leaveEvent and onJoinLeave when "Salir" button is clicked', async () => {
    const nonOrganizerEvent: Event = {
      ...mockEvent,
      organizer: { ...mockUser, id: '2' },
    };
    render(
      <EventCard
        event={nonOrganizerEvent}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    await user.click(screen.getByText(/ya estás unido \(salir\)/i));
    expect(api.leaveEvent).toHaveBeenCalledWith(nonOrganizerEvent.id, mockUser.id);
    expect(mockOnJoinLeave).toHaveBeenCalled();
  });

  it('renders "Unirse al Evento" button for non-attending', () => {
    const nonAttendingEvent: Event = {
      ...mockEvent,
      attendees: [],
      organizer: { ...mockUser, id: '2' },
    };
    render(
      <EventCard
        event={nonAttendingEvent}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    expect(screen.getByText(/unirse al evento/i)).toBeInTheDocument();
  });

  it('calls joinEvent and onJoinLeave when "Unirse" button is clicked', async () => {
    const nonAttendingEvent: Event = {
      ...mockEvent,
      attendees: [],
      organizer: { ...mockUser, id: '2' },
    };
    render(
      <EventCard
        event={nonAttendingEvent}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    await user.click(screen.getByText(/unirse al evento/i));
    expect(api.joinEvent).toHaveBeenCalledWith(nonAttendingEvent.id, mockUser.id);
    expect(mockOnJoinLeave).toHaveBeenCalled();
  });

  it('renders "Completo" button for full event', () => {
    const fullEvent: Event = {
      ...mockEvent,
      attendees: ['2', '3', '4', '5', '6'], // Usuario (id: '1') NO está
      maxAttendees: 5,
      organizer: { ...mockUser, id: '3' }, // Organizador diferente
    };
    render(
      <EventCard
        event={fullEvent}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    const button = screen.getByText(/completo/i);
    expect(button).toBeDisabled();
  });

  it('expands long description on "Ver más" click', async () => {
    const longDescription = 'Long description that exceeds 120 characters. '.repeat(3);
    const longEvent: Event = { ...mockEvent, description: longDescription };
    render(
      <EventCard
        event={longEvent}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    expect(screen.getByText(/ver más/i)).toBeInTheDocument();
    await user.click(screen.getByText(/ver más/i));
    expect(screen.getByText(/ver menos/i)).toBeInTheDocument();
  });
});