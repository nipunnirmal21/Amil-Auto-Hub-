import { useState } from 'react';
import { LockKeyhole, Mail } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import Brand from '../../components/Brand';
import { useAdminAuth } from '../AdminAuthContext';

export default function LoginPage() {
  const { token, login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ busy: false, error: '' });

  if (token) return <Navigate to="/admin/dashboard" replace />;

  const submit = async event => {
    event.preventDefault();
    setStatus({ busy: true, error: '' });
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      setStatus({ busy: false, error: error.message });
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Brand />
        <div className="admin-login-card__heading"><span>SECURE ADMIN ACCESS</span><h1>Welcome back</h1><p>Sign in to manage products, stock, categories, and today’s board.</p></div>
        <form onSubmit={submit}>
          <label>Email address<div className="admin-input-icon"><Mail size={18} /><input type="email" required autoComplete="username" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></div></label>
          <label>Password<div className="admin-input-icon"><LockKeyhole size={18} /><input type="password" required autoComplete="current-password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} /></div></label>
          {status.error && <p className="admin-alert admin-alert--error" role="alert">{status.error}</p>}
          <button className="admin-button admin-button--primary admin-button--full" type="submit" disabled={status.busy}>{status.busy ? 'Signing in…' : 'Sign In'}</button>
        </form>
        <a className="admin-login-card__store" href="/">← Return to storefront</a>
      </section>
    </main>
  );
}
