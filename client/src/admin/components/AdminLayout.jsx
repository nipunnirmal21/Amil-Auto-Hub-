import { useState } from 'react';
import {
  ClipboardList, Gauge, Image, LogOut, Menu, Package, Tags, Users, X,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Brand from '../../components/Brand';
import { useAdminAuth } from '../AdminAuthContext';

const items = [
  ['/admin/dashboard', 'Dashboard', Gauge],
  ['/admin/products', 'Products', Package],
  ['/admin/categories', 'Categories', Tags, 'Admin'],
  ['/admin/billboard', 'Billboard', Image],
  ['/admin/users', 'Users', Users, 'Admin'],
];

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const activeItem = items.find(([path]) => location.pathname.startsWith(path));

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${menuOpen ? ' is-open' : ''}`}>
        <div className="admin-sidebar__brand"><Brand /><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close sidebar"><X /></button></div>
        <p className="admin-sidebar__label">ADMIN PANEL</p>
        <nav aria-label="Admin navigation">
          {items.filter(item => !item[3] || user?.role === item[3]).map(([path, label, Icon]) => (
            <NavLink to={path} key={path} onClick={() => setMenuOpen(false)}>
              <Icon size={19} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__user">
          <ClipboardList size={18} />
          <div><strong>{user?.name}</strong><span>{user?.role}</span></div>
        </div>
        <button className="admin-sidebar__logout" type="button" onClick={logout}><LogOut size={18} />Logout</button>
      </aside>
      {menuOpen && <button className="admin-sidebar-overlay" type="button" aria-label="Close sidebar" onClick={() => setMenuOpen(false)} />}
      <div className="admin-workspace">
        <header className="admin-topbar">
          <button className="admin-menu-toggle" type="button" onClick={() => setMenuOpen(true)} aria-label="Open sidebar"><Menu /></button>
          <div><span>Amil Auto Hub</span><strong>{activeItem?.[1] || 'Administration'}</strong></div>
          <a href="/" target="_blank" rel="noreferrer">View storefront</a>
        </header>
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  );
}
