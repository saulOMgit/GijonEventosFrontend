// __tests__/RegisterForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '@/components/auth/RegisterForm';

vi.mock('@/hooks/useAuth', () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();
  const mockLogout = vi.fn();
  const mockUseAuth = vi.fn();

  mockUseAuth.mockReturnValue({
    user: null,
    credentials: null,
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout,
    loading: false,
    error: null,
  });

  return { useAuth: mockUseAuth };
});

import { useAuth } from '@/hooks/useAuth';

describe('RegisterForm', () => {
  const user = userEvent.setup();
  const mockUseAuth = vi.mocked(useAuth);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      credentials: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loading: false,
      error: null,
    });
  });

  it('renders all form fields and submit button', () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument(); // EXACTO
    expect(screen.getByLabelText(/repetir contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    render(<RegisterForm />);
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/el nombre de usuario es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/el email es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/el teléfono es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    expect(await screen.findByText(/por favor, confirma la contraseña/i)).toBeInTheDocument();
  });

  it('shows password length error when password is too short', async () => {
    render(<RegisterForm />);
    await user.type(screen.getByLabelText(/^contraseña$/i), '123');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    expect(await screen.findByText(/mínimo 6 caracteres/i)).toBeInTheDocument();
  });

  it('shows password mismatch error when passwords do not match', async () => {
    render(<RegisterForm />);
    await user.type(screen.getByLabelText(/^contraseña$/i), 'password123');
    await user.type(screen.getByLabelText(/repetir contraseña/i), 'different123');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  it('calls register with correct data on valid submit', async () => {
    const registerFn = vi.fn().mockResolvedValue({});
    mockUseAuth.mockReturnValue({
      user: null,
      credentials: null,
      login: vi.fn(),
      register: registerFn,
      logout: vi.fn(),
      loading: false,
      error: null,
    });

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/nombre de usuario/i), 'juanperez');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.type(screen.getByLabelText(/teléfono/i), '123456789');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'password123');
    await user.type(screen.getByLabelText(/repetir contraseña/i), 'password123');

    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(registerFn).toHaveBeenCalledWith({
        fullName: 'Juan Pérez',
        username: 'juanperez',
        email: 'juan@example.com',
        phone: '123456789',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });

  it('shows loading state during registration', async () => {
    const registerFn = vi.fn();
    registerFn.mockImplementation(() => new Promise(() => {}));

    mockUseAuth.mockReturnValue({
      user: null,
      credentials: null,
      login: vi.fn(),
      register: registerFn,
      logout: vi.fn(),
      loading: true,
      error: null,
    });

    render(<RegisterForm />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays error message when registration fails', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      credentials: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loading: false,
      error: 'El usuario ya existe',
    });

    render(<RegisterForm />);
    expect(screen.getByText(/el usuario ya existe/i)).toBeInTheDocument();
  });

  it('clears error when starting new registration', async () => {
    const { rerender } = render(<RegisterForm />);

    mockUseAuth.mockReturnValue({
      user: null,
      credentials: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loading: false,
      error: 'Error anterior',
    });
    rerender(<RegisterForm />);
    expect(screen.getByText(/error anterior/i)).toBeInTheDocument();

    mockUseAuth.mockReturnValue({
      user: null,
      credentials: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loading: false,
      error: null,
    });
    rerender(<RegisterForm />);

    await user.type(screen.getByLabelText(/nombre completo/i), 'u');

    expect(screen.queryByText(/error anterior/i)).not.toBeInTheDocument();
  });
});