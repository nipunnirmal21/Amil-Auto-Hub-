import { useEffect, useRef, useState } from 'react';
import { Facebook, Instagram, Mail, Menu, Music2, Phone, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Brand from './Brand';
import ProductSearch from './ProductSearch';
import CartIcon from './CartIcon';
import { business } from '../data/business';

export const nav = [
  ['Home', 'home', 'top'],
  ['About', 'about', 'top'],
  ['Products', 'products', 'products'],
  ['Contact', 'contact', 'contact'],
];

const HIDE_UTILITY_BAR_AT = 40;
const SHOW_UTILITY_BAR_AT = 20;

export default function Header({ searchTerm, onSearchChange }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const showTopBarRef = useRef(true);
  const scrolledRef = useRef(false);

  useEffect(() => {
    let animationFrame = null;

    const updateFromScroll = () => {
      animationFrame = null;
      const scrollY = Math.max(window.scrollY, 0);
      const nextScrolled = scrollY > SHOW_UTILITY_BAR_AT;

      if (scrolledRef.current !== nextScrolled) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }

      if (scrollY > HIDE_UTILITY_BAR_AT && showTopBarRef.current) {
        showTopBarRef.current = false;
        setShowTopBar(false);
      } else if (scrollY <= SHOW_UTILITY_BAR_AT && !showTopBarRef.current) {
        showTopBarRef.current = true;
        setShowTopBar(true);
      }
    };

    const onScroll = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('utility-bar-hidden', !showTopBar);
    return () => document.documentElement.classList.remove('utility-bar-hidden');
  }, [showTopBar]);

  useEffect(() => {
    const escape = event => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}${showTopBar ? '' : ' utility-bar-hidden'}`}>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <p>{business.tagline}</p>
          <div className="utility-bar__links">
            <a href={business.phoneLink}><Phone size={14} />{business.phone}</a>
            <a href={business.emailLink}><Mail size={15} />{business.email}</a>
            <span className="utility-bar__socials" aria-label="Social media">
              <a href={business.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={16} /></a>
              <a href={business.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
              <a href={business.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 size={16} /></a>
            </span>
          </div>
        </div>
      </div>

      <div className="main-nav-bar">
        <div className="container nav-wrap">
          <Brand />
          <div className="mobile-header-actions">
            <CartIcon className="cart-button--mobile" />
            <button
              className="menu-toggle"
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="navigation"
              onClick={() => setOpen(value => !value)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>

          <nav id="navigation" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
            <div className="nav__links">
              {nav.map(([label, key, target]) => (
                <NavLink
                  key={key}
                  to={`/#${target}`}
                  onClick={() => {
                    setOpen(false);
                    if (target === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <div className="header-tools">
              <ProductSearch value={searchTerm} onChange={onSearchChange} />
              <CartIcon />
            </div>
          </nav>
        </div>
      </div>

      <div className="mobile-search-bar">
        <ProductSearch value={searchTerm} onChange={onSearchChange} />
      </div>
    </header>
  );
}
