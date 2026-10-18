import { useEffect, useMemo, useState } from 'react';
import { Edit3, ImagePlus, Save, Trash2, X } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';
import { apiRequest, resolveMediaUrl } from '../adminApi';
import ConfirmModal from '../components/ConfirmModal';

const today = new Date().toISOString().slice(0, 10);
const blankForm = { caption: "Today's Board", date: today, published: true, active: true };

export default function BillboardPage() {
  const { token } = useAdminAuth();
  const [billboards, setBillboards] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [status, setStatus] = useState({ busy: false, error: '' });
  const preview = useMemo(() => image ? URL.createObjectURL(image) : resolveMediaUrl(existingImage), [image, existingImage]);
  const load = () => apiRequest('/admin/billboards', { token }).then(data => setBillboards(data.billboards)).catch(error => setStatus({ busy: false, error: error.message }));
  useEffect(() => { load(); }, [token]);

  const reset = () => { setForm(blankForm); setImage(null); setExistingImage(''); setEditing(null); };
  const submit = async event => {
    event.preventDefault();
    if (!editing && !image) return setStatus({ busy: false, error: 'Choose a billboard image.' });
    setStatus({ busy: true, error: '' });
    const body = new FormData();
    body.append('caption', form.caption); body.append('date', form.date); body.append('published', String(form.published)); body.append('active', String(form.active));
    if (image) body.append('image', image);
    try {
      await apiRequest(editing ? `/admin/billboards/${editing}` : '/admin/billboards', { token, method: editing ? 'PUT' : 'POST', body });
      reset(); setStatus({ busy: false, error: '' }); await load();
    } catch (error) { setStatus({ busy: false, error: error.message }); }
  };
  const remove = async () => {
    setStatus({ busy: true, error: '' });
    try { await apiRequest(`/admin/billboards/${pendingDelete._id}`, { token, method: 'DELETE' }); setPendingDelete(null); setStatus({ busy: false, error: '' }); await load(); }
    catch (error) { setPendingDelete(null); setStatus({ busy: false, error: error.message }); }
  };

  return <div><div className="admin-page-heading"><div><span>DAILY CONTENT</span><h1>Today’s Board</h1><p>Upload today’s handwritten board and keep previous entries in history.</p></div></div>{status.error && <p className="admin-alert admin-alert--error">{status.error}</p>}<div className="admin-billboard-layout"><section className="admin-panel"><div className="admin-panel__heading"><h2>{editing ? 'Edit billboard' : 'Upload today’s board'}</h2></div><form className="admin-compact-form" onSubmit={submit}><label className="admin-image-upload"><ImagePlus /><strong>{editing ? 'Replace image (optional)' : 'Board image *'}</strong><span>{image?.name || 'Choose JPEG, PNG, or WebP'}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setImage(event.target.files[0] || null)} /></label>{preview && <img className="admin-board-preview" src={preview} alt="Billboard preview" />}<label>Caption<input value={form.caption} onChange={event => setForm({ ...form, caption: event.target.value })} /></label><label>Date<input type="date" required value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} /></label><label className="admin-checkbox"><input type="checkbox" checked={form.published} onChange={event => setForm({ ...form, published: event.target.checked, active: event.target.checked ? form.active : false })} />Publish on the storefront</label><label className="admin-checkbox"><input type="checkbox" checked={form.active} disabled={!form.published} onChange={event => setForm({ ...form, active: event.target.checked, published: event.target.checked || form.published })} />Make this the current board</label><small>Published non-current boards appear in public history. Drafts remain admin-only.</small><div className="admin-form-actions">{editing && <button className="admin-button admin-button--ghost" type="button" onClick={reset}><X size={16} />Cancel</button>}<button className="admin-button admin-button--primary" disabled={status.busy}><Save size={17} />{status.busy ? 'Saving…' : 'Save Board'}</button></div></form></section><section className="admin-panel"><div className="admin-panel__heading"><h2>Billboard history</h2></div><div className="admin-billboard-history">{billboards.map(board => { const publicationLabel = board.active ? 'Current' : board.publishedAt ? 'Published' : 'Draft'; return <article key={board._id}><img src={resolveMediaUrl(board.image)} alt="" /><div><strong>{board.caption || "Today's Board"}</strong><span>{new Date(board.date).toLocaleDateString('en-LK', { timeZone: 'Asia/Colombo' })}</span><span className={`admin-status ${board.active ? 'admin-status--in-stock' : 'admin-status--inactive'}`}>{publicationLabel}</span></div><div className="admin-row-actions"><button type="button" aria-label={`Edit ${board.caption || 'billboard'}`} onClick={() => { setEditing(board._id); setExistingImage(board.image); setImage(null); setForm({ caption: board.caption || '', date: new Date(board.date).toISOString().slice(0, 10), published: Boolean(board.publishedAt || board.active), active: board.active }); }}><Edit3 size={16} /></button><button type="button" aria-label={`Delete ${board.caption || 'billboard'}`} onClick={() => setPendingDelete(board)}><Trash2 size={16} /></button></div></article>; })}{!billboards.length && <p className="admin-empty">No billboard history yet.</p>}</div></section></div><ConfirmModal title={pendingDelete ? 'Delete billboard?' : ''} message="This removes the history record. Upload files are retained for operational safety." busy={status.busy} onCancel={() => setPendingDelete(null)} onConfirm={remove} /></div>;
}
