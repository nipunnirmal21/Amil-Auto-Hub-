import { useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';
import { apiRequest, resolveMediaUrl } from '../adminApi';
import ConfirmModal from '../components/ConfirmModal';

const formatLkr = value => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(value || 0);

export default function ProductsPage() {
  const { token, logout } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', stock: '', active: '' });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: '', deleting: false });

  const load = async () => {
    try {
      const [productData, categoryData] = await Promise.all([
        apiRequest('/admin/products', { token }), apiRequest('/admin/categories', { token }),
      ]);
      setProducts(productData.products);
      setCategories(categoryData.categories);
      setStatus({ loading: false, error: '', deleting: false });
    } catch (error) {
      if (error.status === 401) logout(); else setStatus(current => ({ ...current, loading: false, error: error.message }));
    }
  };
  useEffect(() => { load(); }, [token]);

  const filtered = useMemo(() => products.filter(product => (
    (!filters.search || [product.name, product.brand, product.sku].some(value => String(value || '').toLowerCase().includes(filters.search.toLowerCase())))
    && (!filters.category || product.category?._id === filters.category)
    && (!filters.stock || product.stockStatus === filters.stock)
    && (!filters.active || String(product.active) === filters.active)
  )), [products, filters]);

  const confirmDelete = async () => {
    setStatus(current => ({ ...current, deleting: true, error: '' }));
    try {
      await apiRequest(`/admin/products/${pendingDelete._id}`, { token, method: 'DELETE' });
      setProducts(items => items.filter(item => item._id !== pendingDelete._id));
      setPendingDelete(null);
      setStatus(current => ({ ...current, deleting: false }));
    } catch (error) {
      setPendingDelete(null);
      setStatus(current => ({ ...current, deleting: false, error: error.message }));
    }
  };

  return <div><div className="admin-page-heading"><div><span>CATALOGUE</span><h1>Products</h1><p>Manage product information, pricing, stock, and visibility.</p></div><Link className="admin-button admin-button--primary" to="/admin/products/new"><Plus size={18} />Add New Product</Link></div>{status.error && <p className="admin-alert admin-alert--error">{status.error}</p>}<section className="admin-panel"><div className="admin-filters"><label className="admin-filter-search"><Search size={17} /><input value={filters.search} onChange={event => setFilters({ ...filters, search: event.target.value })} placeholder="Search products…" /></label><select value={filters.category} onChange={event => setFilters({ ...filters, category: event.target.value })}><option value="">All categories</option>{categories.map(category => <option value={category._id} key={category._id}>{category.name}</option>)}</select><select value={filters.stock} onChange={event => setFilters({ ...filters, stock: event.target.value })}><option value="">All stock</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></select><select value={filters.active} onChange={event => setFilters({ ...filters, active: event.target.value })}><option value="">All visibility</option><option value="true">Active</option><option value="false">Inactive</option></select></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{filtered.map(product => <tr key={product._id}><td><div className="admin-product-cell"><img src={resolveMediaUrl(product.mainImage)} alt="" /><div><strong>{product.name}</strong><span>{product.brand || 'No brand'}{product.featured ? ' · Featured' : ''}</span></div></div></td><td>{product.category?.name || '—'}<small>{product.subcategory?.name || ''}</small></td><td>{formatLkr(product.price)}</td><td>{product.stockQuantity}</td><td><span className={`admin-status admin-status--${product.stockStatus.toLowerCase().replaceAll(' ', '-')}`}>{product.stockStatus}</span>{!product.active && <span className="admin-status admin-status--inactive">Inactive</span>}</td><td>{new Date(product.updatedAt).toLocaleDateString()}</td><td><div className="admin-row-actions"><Link to={`/admin/products/${product._id}/edit`} aria-label={`Edit ${product.name}`}><Edit3 size={17} /></Link><button type="button" onClick={() => setPendingDelete(product)} aria-label={`Delete ${product.name}`}><Trash2 size={17} /></button></div></td></tr>)}</tbody></table>{!status.loading && !filtered.length && <p className="admin-empty">No products match these filters.</p>}</div></section><ConfirmModal title={pendingDelete ? 'Delete product?' : ''} message={pendingDelete ? `${pendingDelete.name} will be permanently removed from the catalogue.` : ''} busy={status.deleting} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} /></div>;
}
