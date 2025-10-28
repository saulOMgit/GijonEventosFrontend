// __tests__/LoginForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/auth/LoginForm';

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

describe('LoginForm', () => {
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

  it('renders login form with inputs and button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    render(<LoginForm />);
    await user.clear(screen.getByLabelText(/nombre de usuario/i));
    await user.clear(screen.getByLabelText(/contraseña/i));
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    expect(await screen.findByText(/el nombre de usuario es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
  });

  it('calls login with correct credentials on submit', async () => {
    const loginFn = vi.fn().mockResolvedValue({});
    mockUseAuth.mockReturnValue({
      user: null,
      credentials: null,
      login: loginFn,
      register: vi.fn(),
      logout: vi.fn(),
      loading: false,
      error: null,
    });

    render(<LoginForm />);
    const usernameInput = screen.getByLabelText(/nombre de usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    await user.clear(usernameInput);
    await user.clear(passwordInput);
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'secret123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    await waitFor(() => expect(loginFn).toHaveBeenCalledWith('testuser', 'secret123'));
  });

  it('shows loading state during login', async () => {
    const loginFn = vi.fn();
    loginFn.mockImplementation(() => new Promise(() => {}));

    mockUseAuth.mockReturnValue({
      user: null,
      credentials: null,
      login: loginFn,
      register: vi.fn(),
      logout: vi.fn(),
      loading: true,
      error: null,
    });

    render(<LoginForm />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    // AHORA FUNCIONA
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toHaveClass('animate-spin');
  });

  it('displays error message when login fails', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      credentials: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loading: false,
      error: 'Credenciales inválidas',
    });

    render(<LoginForm />);
    expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
  });

  it('clears error when starting new login', async () => {
    const { rerender } = render(<LoginForm />);
    mockUseAuth.mockReturnValue({
      user: null,
      credentials: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loading: false,
      error: 'Error anterior',
    });
    rerender(<LoginForm />);
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
    rerender(<LoginForm />);
    await user.clear(screen.getByLabelText(/nombre de usuario/i));
    await user.type(screen.getByLabelText(/nombre de usuario/i), 'u');
    expect(screen.queryByText(/error anterior/i)).not.toBeInTheDocument();
  });
});