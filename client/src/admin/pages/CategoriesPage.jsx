import { useEffect, useState } from 'react';
import { Edit3, Plus, Save, Trash2, X } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';
import { apiRequest } from '../adminApi';
import ConfirmModal from '../components/ConfirmModal';

const blankCategory = { name: '', slug: '', icon: 'circle-dot', active: true };
const blankSubcategory = { name: '', slug: '', parentCategory: '', active: true };

export default function CategoriesPage() {
  const { token, user } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState(blankCategory);
  const [subcategoryForm, setSubcategoryForm] = useState(blankSubcategory);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [status, setStatus] = useState({ error: '', busy: false });

  const load = () => apiRequest('/admin/categories', { token }).then(data => setCategories(data.categories)).catch(error => setStatus({ error: error.message, busy: false }));
  useEffect(() => { load(); }, [token]);

  if (user?.role !== 'Admin') return <div className="admin-panel admin-access-denied"><h1>Admin access required</h1><p>Staff accounts can manage products, stock, and billboards.</p></div>;

  const saveCategory = async event => {
    event.preventDefault(); setStatus({ error: '', busy: true });
    try {
      await apiRequest(editingCategory ? `/admin/categories/${editingCategory}` : '/admin/categories', { token, method: editingCategory ? 'PUT' : 'POST', body: categoryForm });
      setCategoryForm(blankCategory); setEditingCategory(null); setStatus({ error: '', busy: false }); await load();
    } catch (error) { setStatus({ error: error.message, busy: false }); }
  };
  const saveSubcategory = async event => {
    event.preventDefault(); setStatus({ error: '', busy: true });
    try {
      await apiRequest(editingSubcategory ? `/admin/subcategories/${editingSubcategory}` : '/admin/subcategories', { token, method: editingSubcategory ? 'PUT' : 'POST', body: subcategoryForm });
      setSubcategoryForm(blankSubcategory); setEditingSubcategory(null); setStatus({ error: '', busy: false }); await load();
    } catch (error) { setStatus({ error: error.message, busy: false }); }
  };
  const confirmDelete = async () => {
    setStatus({ error: '', busy: true });
    try {
      await apiRequest(`/admin/${pendingDelete.type}/${pendingDelete.id}`, { token, method: 'DELETE' });
      setPendingDelete(null); setStatus({ error: '', busy: false }); await load();
    } catch (error) { setPendingDelete(null); setStatus({ error: error.message, busy: false }); }
  };

  return <div><div className="admin-page-heading"><div><span>CATALOGUE STRUCTURE</span><h1>Categories</h1><p>Manage main categories and their related subcategories.</p></div></div>{status.error && <p className="admin-alert admin-alert--error">{status.error}</p>}<div className="admin-category-layout"><div><section className="admin-panel"><div className="admin-panel__heading"><h2>{editingCategory ? 'Edit main category' : 'Add main category'}</h2></div><form className="admin-compact-form" onSubmit={saveCategory}><label>Name<input required value={categoryForm.name} onChange={event => setCategoryForm({ ...categoryForm, name: event.target.value })} /></label><label>Slug<input value={categoryForm.slug} onChange={event => setCategoryForm({ ...categoryForm, slug: event.target.value })} placeholder="Generated automatically" /></label><label>Icon key<input value={categoryForm.icon} onChange={event => setCategoryForm({ ...categoryForm, icon: event.target.value })} /></label><label className="admin-checkbox"><input type="checkbox" checked={categoryForm.active} onChange={event => setCategoryForm({ ...categoryForm, active: event.target.checked })} />Active</label><div className="admin-form-actions">{editingCategory && <button className="admin-button admin-button--ghost" type="button" onClick={() => { setEditingCategory(null); setCategoryForm(blankCategory); }}><X size={16} />Cancel</button>}<button className="admin-button admin-button--primary" disabled={status.busy}><Save size={16} />Save</button></div></form></section><section className="admin-panel"><div className="admin-panel__heading"><h2>{editingSubcategory ? 'Edit subcategory' : 'Add subcategory'}</h2></div><form className="admin-compact-form" onSubmit={saveSubcategory}><label>Parent category<select required value={subcategoryForm.parentCategory} onChange={event => setSubcategoryForm({ ...subcategoryForm, parentCategory: event.target.value })}><option value="">Select category</option>{categories.map(category => <option value={category._id} key={category._id}>{category.name}</option>)}</select></label><label>Name<input required value={subcategoryForm.name} onChange={event => setSubcategoryForm({ ...subcategoryForm, name: event.target.value })} /></label><label>Slug<input value={subcategoryForm.slug} onChange={event => setSubcategoryForm({ ...subcategoryForm, slug: event.target.value })} placeholder="Generated automatically" /></label><label className="admin-checkbox"><input type="checkbox" checked={subcategoryForm.active} onChange={event => setSubcategoryForm({ ...subcategoryForm, active: event.target.checked })} />Active</label><div className="admin-form-actions">{editingSubcategory && <button className="admin-button admin-button--ghost" type="button" onClick={() => { setEditingSubcategory(null); setSubcategoryForm(blankSubcategory); }}><X size={16} />Cancel</button>}<button className="admin-button admin-button--primary" disabled={status.busy}><Plus size={16} />Save</button></div></form></section></div><section className="admin-panel"><div className="admin-panel__heading"><h2>Category structure</h2><p>Categories in use cannot be deleted until products are reassigned.</p></div><div className="admin-category-list">{categories.map(category => <article key={category._id}><div className="admin-category-list__main"><div><strong>{category.name}</strong><span>/{category.slug} · {category.active ? 'Active' : 'Inactive'}</span></div><div className="admin-row-actions"><button type="button" onClick={() => { setEditingCategory(category._id); setCategoryForm({ name: category.name, slug: category.slug, icon: category.icon, active: category.active }); }}><Edit3 size={16} /></button><button type="button" onClick={() => setPendingDelete({ type: 'categories', id: category._id, name: category.name })}><Trash2 size={16} /></button></div></div><div className="admin-subcategory-list">{category.subcategories.map(item => <div key={item._id}><span>{item.name}<small>/{item.slug}</small></span><div className="admin-row-actions"><button type="button" onClick={() => { setEditingSubcategory(item._id); setSubcategoryForm({ name: item.name, slug: item.slug, parentCategory: category._id, active: item.active }); }}><Edit3 size={15} /></button><button type="button" onClick={() => setPendingDelete({ type: 'subcategories', id: item._id, name: item.name })}><Trash2 size={15} /></button></div></div>)}{!category.subcategories.length && <p>No subcategories.</p>}</div></article>)}</div></section></div><ConfirmModal title={pendingDelete ? `Delete ${pendingDelete.name}?` : ''} message="This action is blocked automatically if any product still uses this category." busy={status.busy} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} /></div>;
}
