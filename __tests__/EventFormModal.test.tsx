// __tests__/EventFormModal.test.tsx
/// <reference types="vitest/globals" />

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import EventFormModal from '@/components/events/EventFormModal';
import { Event, User } from '@/types';
import * as api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

// ---------------------------------------------------------------------
// MOCKS
// ---------------------------------------------------------------------
vi.mock('@/hooks/useAuth');
vi.mock('@/services/api');

const mockUser: User = {
  id: '1',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  phone: '123456789',
  role: 'ROLE_USER',
};

const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

const renderWithAuth = (ui: React.ReactElement) => {
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

describe('EventFormModal', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.createEvent).mockResolvedValue(undefined);
    vi.mocked(api.updateEvent).mockResolvedValue(undefined);
  });

  // 1. No renderiza si isOpen=false
  it('no renderiza el modal cuando isOpen es false', () => {
    renderWithAuth(<EventFormModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // 2. Renderiza formulario vacío en modo crear
  it('renderiza el formulario vacío en modo crear', () => {
    renderWithAuth(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);
    expect(screen.getByRole('heading', { name: /crear nuevo evento/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/título/i)).toHaveValue('');
    expect(screen.getByLabelText(/descripción/i)).toHaveValue('');
    expect(screen.getByLabelText(/fecha y hora/i)).toHaveValue('');
    expect(screen.getByLabelText(/ubicación/i)).toHaveValue('');
    expect(screen.getByLabelText(/máximo de asistentes/i)).toHaveValue(10);
    expect(screen.getByRole('button', { name: /crear evento/i })).toBeInTheDocument();
  });

  // 3. Carga datos en modo edición
  it('carga los datos del evento en modo edición', () => {
    const mockEvent: Event = {
      id: '1',
      title: 'Evento Edit',
      description: 'Descripción',
      date: '2025-12-01T15:30:00',
      location: 'Sala Principal',
      organizer: mockUser,
      attendees: [],
      maxAttendees: 50,
    };
    renderWithAuth(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={mockEvent} />);
    expect(screen.getByRole('heading', { name: /editar evento/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/título/i)).toHaveValue('Evento Edit');
    expect(screen.getByLabelText(/descripción/i)).toHaveValue('Descripción');
    expect(screen.getByLabelText(/fecha y hora/i)).toHaveValue('2025-12-01T15:30');
    expect(screen.getByLabelText(/ubicación/i)).toHaveValue('Sala Principal');
    expect(screen.getByLabelText(/máximo de asistentes/i)).toHaveValue(50);
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();
  });

  // 4. Muestra errores cuando campos obligatorios están vacíos
  it('muestra errores cuando los campos obligatorios están vacíos', async () => {
    renderWithAuth(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);
    await user.click(screen.getByRole('button', { name: /crear evento/i }));

    await waitFor(() => {
      expect(screen.getByText(/el título es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/la descripción es obligatoria/i)).toBeInTheDocument();
      expect(screen.getByText(/la fecha es obligatoria/i)).toBeInTheDocument();
      expect(screen.getByText(/la ubicación es obligatoria/i)).toBeInTheDocument();
    });
  });

  // 5. Muestra error si la fecha está en el pasado
  it('muestra error si la fecha está en el pasado', async () => {
    renderWithAuth(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);
    await user.type(screen.getByLabelText(/título/i), 'Evento Pasado');
    await user.type(screen.getByLabelText(/descripción/i), 'Desc');
    await user.type(screen.getByLabelText(/ubicación/i), 'Sala');
    await user.type(screen.getByLabelText(/fecha y hora/i), '2020-01-01T10:00');
    await user.click(screen.getByRole('button', { name: /crear evento/i }));

    await waitFor(() => {
      expect(screen.getByText(/no se pueden crear eventos en el pasado/i)).toBeInTheDocument();
    });
  });

  // 6. Muestra error si maxAttendees es menor que 1
  it('muestra error si maxAttendees es menor que 1', async () => {
    renderWithAuth(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);
    await user.type(screen.getByLabelText(/título/i), 'Evento');
    await user.type(screen.getByLabelText(/descripción/i), 'Desc');
    await user.type(screen.getByLabelText(/fecha y hora/i), '2025-12-01T10:00');
    await user.type(screen.getByLabelText(/ubicación/i), 'Sala');
    await user.clear(screen.getByLabelText(/máximo de asistentes/i));
    await user.type(screen.getByLabelText(/máximo de asistentes/i), '0');
    await user.click(screen.getByRole('button', { name: /crear evento/i }));

    await waitFor(() => {
      expect(screen.getByText(/debe ser al menos 1/i)).toBeInTheDocument();
    });
  });

  // 7. Llama a createEvent con datos válidos y userId como segundo argumento
  it('llama a createEvent con datos válidos y userId como segundo argumento', async () => {
    renderWithAuth(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);

    // LIMPIAR + ESCRIBIR en cada campo
    await user.clear(screen.getByLabelText(/título/i));
    await user.type(screen.getByLabelText(/título/i), 'Nuevo Evento');

    await user.clear(screen.getByLabelText(/descripción/i));
    await user.type(screen.getByLabelText(/descripción/i), 'Descripción completa');

    await user.clear(screen.getByLabelText(/fecha y hora/i));
    await user.type(screen.getByLabelText(/fecha y hora/i), '2025-12-01T14:30');

    await user.clear(screen.getByLabelText(/ubicación/i));
    await user.type(screen.getByLabelText(/ubicación/i), 'Auditorio Principal');

    await user.clear(screen.getByLabelText(/máximo de asistentes/i));
    await user.type(screen.getByLabelText(/máximo de asistentes/i), '30');

    await user.click(screen.getByRole('button', { name: /crear evento/i }));

    await waitFor(() => {
      expect(api.createEvent).toHaveBeenCalledWith(
        {
          title: 'Nuevo Evento',
          description: 'Descripción completa',
          date: expect.stringContaining('2025-12-01T14:30'), // componente debe agregar :00
          location: 'Auditorio Principal',
          maxAttendees: 30,
        },
        '1'
      );
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // 8. Llama a updateEvent con id y todo el objeto del evento actualizado
  it('llama a updateEvent con id y todo el objeto del evento actualizado', async () => {
    const mockEvent: Event = {
      id: '99',
      title: 'Evento Antiguo',
      description: 'Descripción antigua',
      date: '2025-12-01T10:00:00',
      location: 'Sala 1',
      organizer: mockUser,
      attendees: [],
      maxAttendees: 20,
    };

    renderWithAuth(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={mockEvent} />);

    await user.clear(screen.getByLabelText(/título/i));
    await user.type(screen.getByLabelText(/título/i), 'Evento Actualizado');

    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(api.updateEvent).toHaveBeenCalledWith('99', {
        id: '99',
        title: 'Evento Actualizado',
        description: 'Descripción antigua',
        date: '2025-12-01T10:00:00',
        location: 'Sala 1',
        maxAttendees: 20,
        organizer: mockUser,
        attendees: [],
      });
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // 9. Maneja error de API sin romper
 /*  it('maneja error de API sin romper', async () => {
    vi.mocked(api.createEvent).mockRejectedValue(new Error('Network Error'));

    renderWithAuth(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);

    await user.clear(screen.getByLabelText(/título/i));
    await user.type(screen.getByLabelText(/título/i), 'Falla');

    await user.clear(screen.getByLabelText(/descripción/i));
    await user.type(screen.getByLabelText(/descripción/i), 'X');

    await user.clear(screen.getByLabelText(/fecha y hora/i));
    await user.type(screen.getByLabelText(/fecha y hora/i), '2025-12-01T10:00');

    await user.clear(screen.getByLabelText(/ubicación/i));
    await user.type(screen.getByLabelText(/ubicación/i), 'X');

    await user.clear(screen.getByLabelText(/máximo de asistentes/i));
    await user.type(screen.getByLabelText(/máximo de asistentes/i), '10');

    await user.click(screen.getByRole('button', { name: /crear evento/i }));

    await waitFor(() => {
      expect(api.createEvent).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  }); */

  // 10. Deshabilita botón y muestra spinner mientras carga
  it('deshabilita el botón y muestra spinner mientras carga', async () => {
    vi.mocked(api.createEvent).mockImplementation(() => new Promise(() => {})); // nunca resuelve

    renderWithAuth(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);

    await user.clear(screen.getByLabelText(/título/i));
    await user.type(screen.getByLabelText(/título/i), 'X');

    await user.clear(screen.getByLabelText(/descripción/i));
    await user.type(screen.getByLabelText(/descripción/i), 'X');

    await user.clear(screen.getByLabelText(/fecha y hora/i));
    await user.type(screen.getByLabelText(/fecha y hora/i), '2025-12-01T10:00');

    await user.clear(screen.getByLabelText(/ubicación/i));
    await user.type(screen.getByLabelText(/ubicación/i), 'X');

    await user.clear(screen.getByLabelText(/máximo de asistentes/i));
    await user.type(screen.getByLabelText(/máximo de asistentes/i), '10');

    await user.click(screen.getByRole('button', { name: /crear evento/i }));

    const button = screen.getByRole('button', { name: '' }); // texto oculto por spinner
    expect(button).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  // 11. Limpia errores al cerrar y volver a abrir
  it('limpia los errores de validación al cerrar y volver a abrir el modal', async () => {
    const { rerender } = renderWithAuth(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);
    
    await user.click(screen.getByRole('button', { name: /crear evento/i }));
    await waitFor(() => expect(screen.getByText(/el título es obligatorio/i)).toBeInTheDocument());

    rerender(<EventFormModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);
    rerender(<EventFormModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} event={null} />);

    expect(screen.queryByText(/el título es obligatorio/i)).not.toBeInTheDocument();
  });
});