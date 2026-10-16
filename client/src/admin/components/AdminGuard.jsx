import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';
import { apiRequest } from '../adminApi';

export default function AdminGuard() {
  const { token, logout, updateUser } = useAdminAuth();
  const [checking, setChecking] = useState(Boolean(token));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    let active = true;
    setChecking(true);
    setError('');
    apiRequest('/admin/me', { token })
      .then(({ user }) => {
        if (!active) return;
        updateUser(user);
        setChecking(false);
      })
      .catch(requestError => {
        if (!active) return;
        if (requestError.status === 401 || requestError.status === 403) logout();
        else {
          setError(requestError.message);
          setChecking(false);
        }
      });
    return () => { active = false; };
  }, [token, logout, updateUser]);

  if (!token) return <Navigate to="/admin/login" replace />;
  if (checking) return <main className="admin-login-page"><p className="admin-loading">Checking admin session…</p></main>;
  if (error) return <main className="admin-login-page"><section className="admin-login-card"><h1>Admin unavailable</h1><p>{error}</p><button className="admin-button admin-button--ghost admin-button--full" type="button" onClick={logout}>Return to login</button></section></main>;
  return <Outlet />;
}
