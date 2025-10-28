// __tests__/useAuth.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import * as api from '@/services/api';

vi.mock('@/services/api');

const mockUser = {
  id: '1',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  phone: '123456789',
  role: 'ROLE_USER',
};

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should login successfully', async () => {
    (api.login as any).mockResolvedValue(mockUser); // Usa 'any' temporalmente si persiste

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login('testuser', 'password123');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  it('should register successfully', async () => {
    (api.register as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    const registerData = {
      fullName: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      phone: '123456789',
      password: 'password123',
      confirmPassword: 'password123',
    };

    await act(async () => {
      await result.current.register(registerData);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should logout', async () => {
    (api.login as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login('testuser', 'pass');
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(sessionStorage.getItem('credentials')).toBeNull();
  });

  it('should handle login error', async () => {
    (api.login as any).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await expect(result.current.login('wrong', 'wrong')).rejects.toThrow();
    });

    expect(result.current.error).toBe('Invalid credentials');
  });
});