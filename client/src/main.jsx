import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import PromoHero from './components/PromoHero';
import Products from './sections/Products';
import WhyUs from './sections/WhyUs';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import AdminApp from './admin/AdminApp';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import './styles/main.css';
import './styles/category-nav.css';
import './styles/site-updates.css';
import './styles/cart.css';
import './styles/product-details.css';
import './styles/home-redesign.css';
import './styles/admin.css';

const allProductsFilter = { categoryId: 'all', subcategoryId: null, label: 'All Products' };

function PublicApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [productFilter, setProductFilter] = useState(allProductsFilter);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [location]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }), { threshold: .06 });
    document.querySelectorAll('.section').forEach(element => {
      element.classList.add('reveal');
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const handleSearchChange = value => {
    setSearchTerm(value);
    if (value.trim()) {
      setProductFilter(allProductsFilter);
      if (location.pathname !== '/') navigate('/#products');
    }
  };

  const handleCategoryChange = filter => {
    setProductFilter(filter);
    setSearchTerm('');
    if (location.pathname !== '/') navigate('/#products');
  };

  return (
    <>
      <div id="top" />
      <a className="skip-link" href="#main">Skip to content</a>
      <Header searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <CategoryNav activeFilter={productFilter} onFilterChange={handleCategoryChange} />
      <main id="main">
        <Routes>
          <Route path="/" element={(
            <>
              <PromoHero />
              <Products
                activeFilter={productFilter}
                searchTerm={searchTerm}
                onResetFilter={() => setProductFilter(allProductsFilter)}
              />
              <WhyUs />
              <Contact />
            </>
          )} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="*" element={<ProductDetails />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

function RootApp() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return <AdminAuthProvider><AdminApp /></AdminAuthProvider>;
  }
  return <CartProvider><PublicApp /></CartProvider>;
}

createRoot(document.getElementById('root')).render(<BrowserRouter><RootApp /></BrowserRouter>);
