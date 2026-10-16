import { useEffect, useState } from 'react';
import { AlertTriangle, Boxes, Layers3, PackageCheck, PackageX, Tags } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';
import { apiRequest } from '../adminApi';

const cards = [
  ['totalProducts', 'Total Products', Boxes],
  ['inStock', 'In Stock Products', PackageCheck],
  ['lowStock', 'Low Stock Products', AlertTriangle],
  ['outOfStock', 'Out of Stock Products', PackageX],
  ['totalCategories', 'Main Categories', Tags],
  ['totalSubcategories', 'Subcategories', Layers3],
];

function RecentList({ title, products }) {
  return <section className="admin-panel"><div className="admin-panel__heading"><h2>{title}</h2></div><div className="admin-recent-list">{products.length ? products.map(product => <div key={product._id}><div><strong>{product.name}</strong><span>{product.category?.name || 'Unassigned'}</span></div><span>{new Date(product.updatedAt).toLocaleDateString()}</span></div>) : <p className="admin-empty">No products yet.</p>}</div></section>;
}

export default function DashboardPage() {
  const { token, logout } = useAdminAuth();
  const [data, setData] = useState({ summary: {}, recentlyAdded: [], recentlyUpdated: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/admin/dashboard', { token }).then(setData).catch(requestError => {
      if (requestError.status === 401) logout(); else setError(requestError.message);
    });
  }, [token, logout]);

  return <div><div className="admin-page-heading"><div><span>OVERVIEW</span><h1>Dashboard</h1><p>A quick view of catalogue and stock activity.</p></div></div>{error && <p className="admin-alert admin-alert--error">{error}</p>}<div className="admin-summary-grid">{cards.map(([key, label, Icon]) => <article key={key}><span><Icon /></span><div><strong>{data.summary[key] ?? '—'}</strong><p>{label}</p></div></article>)}</div><div className="admin-dashboard-columns"><RecentList title="Recently Added" products={data.recentlyAdded} /><RecentList title="Recently Updated" products={data.recentlyUpdated} /></div></div>;
}
