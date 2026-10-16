import { useEffect, useState } from 'react';
import { Edit3, Save, Trash2, X } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';
import { apiRequest } from '../adminApi';
import ConfirmModal from '../components/ConfirmModal';

const blankForm = { name: '', email: '', password: '', role: 'Staff', active: true };

export default function UsersPage() {
  const { token, user } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [status, setStatus] = useState({ busy: false, error: '' });
  const load = () => apiRequest('/admin/users', { token }).then(data => setUsers(data.users)).catch(error => setStatus({ busy: false, error: error.message }));
  useEffect(() => { if (user?.role === 'Admin') load(); }, [token, user?.role]);
  if (user?.role !== 'Admin') return <div className="admin-panel admin-access-denied"><h1>Admin access required</h1><p>Staff accounts cannot manage admin users.</p></div>;

  const reset = () => { setForm(blankForm); setEditing(null); };
  const submit = async event => {
    event.preventDefault(); setStatus({ busy: true, error: '' });
    try {
      const body = { ...form }; if (editing && !body.password) delete body.password;
      await apiRequest(editing ? `/admin/users/${editing}` : '/admin/users', { token, method: editing ? 'PUT' : 'POST', body });
      reset(); setStatus({ busy: false, error: '' }); await load();
    } catch (error) { setStatus({ busy: false, error: error.message }); }
  };
  const remove = async () => {
    setStatus({ busy: true, error: '' });
    try { await apiRequest(`/admin/users/${pendingDelete._id}`, { token, method: 'DELETE' }); setPendingDelete(null); setStatus({ busy: false, error: '' }); await load(); }
    catch (error) { setPendingDelete(null); setStatus({ busy: false, error: error.message }); }
  };

  return <div><div className="admin-page-heading"><div><span>ACCESS CONTROL</span><h1>Admin Users</h1><p>Admin users have full access. Staff can manage products, stock, and billboards.</p></div></div>{status.error && <p className="admin-alert admin-alert--error">{status.error}</p>}<div className="admin-users-layout"><section className="admin-panel"><div className="admin-panel__heading"><h2>{editing ? 'Edit user' : 'Add admin user'}</h2></div><form className="admin-compact-form" onSubmit={submit}><label>Name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label><label>Email<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label><label>{editing ? 'New password (optional)' : 'Password *'}<input required={!editing} type="password" minLength="10" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} /><small>Minimum 10 characters.</small></label><label>Role<select value={form.role} onChange={event => setForm({ ...form, role: event.target.value })}><option>Staff</option><option>Admin</option></select></label><label className="admin-checkbox"><input type="checkbox" checked={form.active} onChange={event => setForm({ ...form, active: event.target.checked })} />Active account</label><div className="admin-form-actions">{editing && <button className="admin-button admin-button--ghost" type="button" onClick={reset}><X size={16} />Cancel</button>}<button className="admin-button admin-button--primary" disabled={status.busy}><Save size={16} />Save User</button></div></form></section><section className="admin-panel"><div className="admin-panel__heading"><h2>Current users</h2></div><div className="admin-user-list">{users.map(item => <article key={item._id}><div className="admin-user-avatar">{item.name.slice(0, 1).toUpperCase()}</div><div><strong>{item.name}</strong><span>{item.email}</span><small>{item.role} · {item.active ? 'Active' : 'Inactive'}</small></div><div className="admin-row-actions"><button type="button" onClick={() => { setEditing(item._id); setForm({ name: item.name, email: item.email, password: '', role: item.role, active: item.active }); }}><Edit3 size={16} /></button><button type="button" disabled={item._id === user._id} onClick={() => setPendingDelete(item)}><Trash2 size={16} /></button></div></article>)}</div></section></div><ConfirmModal title={pendingDelete ? `Delete ${pendingDelete.name}?` : ''} message="This user will immediately lose administrative access." busy={status.busy} onCancel={() => setPendingDelete(null)} onConfirm={remove} /></div>;
}
