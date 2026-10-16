import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { apiRequest } from './adminApi';

const STORAGE_KEY = 'amil-admin-session';
const AdminAuthContext = createContext(null);

function readSession() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || null; } catch { return null; }
}

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = useCallback(async (email, password) => {
    const nextSession = await apiRequest('/admin/login', { method: 'POST', body: { email, password } });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const updateUser = useCallback(user => {
    setSession(current => {
      if (!current) return current;
      const next = { ...current, user };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    token: session?.token || '',
    user: session?.user || null,
    login,
    logout,
    updateUser,
  }), [session, login, logout, updateUser]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
