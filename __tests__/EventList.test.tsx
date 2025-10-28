/// <reference types="vitest/globals" />
// __tests__/EventList.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import EventList from '@/components/events/EventList';
import { Event, User } from '@/types';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth');

const mockUser: User = {
  id: '1',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  phone: '123456789',
  role: 'ROLE_USER',
};

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Event 1',
    description: 'Description 1',
    date: '2025-10-28T10:00:00',
    location: 'Gijón',
    organizer: mockUser,
    attendees: [],
    maxAttendees: 10,
  },
  {
    id: '2',
    title: 'Event 2',
    description: 'Description 2',
    date: '2025-10-29T10:00:00',
    location: 'Oviedo',
    organizer: { ...mockUser, id: '2' },
    attendees: ['1'],
    maxAttendees: 5,
  },
];

const renderWithMockAuth = (ui: React.ReactElement) => {
  vi.mocked(useAuth).mockReturnValue({
    user: mockUser,
    credentials: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    loading: false,
    error: null,
  });
  return render(ui);
};

describe('EventList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders spinner when loading', () => {
    renderWithMockAuth(
      <EventList events={[]} loading={true} onEdit={() => {}} onRequestDelete={() => {}} onJoinLeave={() => {}} />
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders no events message when empty', () => {
    renderWithMockAuth(
      <EventList events={[]} loading={false} onEdit={() => {}} onRequestDelete={() => {}} onJoinLeave={() => {}} />
    );
    expect(screen.getByText(/no se encontraron eventos/i)).toBeInTheDocument();
  });

  it('renders EventCards when events exist', () => {
    renderWithMockAuth(
      <EventList events={mockEvents} loading={false} onEdit={() => {}} onRequestDelete={() => {}} onJoinLeave={() => {}} />
    );
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('passes correct props to EventCard', () => {
    const mockOnEdit = vi.fn();
    const mockOnRequestDelete = vi.fn();
    const mockOnJoinLeave = vi.fn();

    const eventsWithJoinable = [
      ...mockEvents,
      {
        id: '3',
        title: 'Event 3',
        description: 'Joinable event',
        date: '2025-10-30T10:00:00',
        location: 'Avilés',
        organizer: { ...mockUser, id: '3' },
        attendees: [],
        maxAttendees: 10,
      },
    ];

    renderWithMockAuth(
      <EventList
        events={eventsWithJoinable}
        loading={false}
        onEdit={mockOnEdit}
        onRequestDelete={mockOnRequestDelete}
        onJoinLeave={mockOnJoinLeave}
      />
    );

    expect(screen.getByText(/unirse al evento/i)).toBeInTheDocument();
  });
});