import { useCallback, useEffect, useRef, useState } from 'react';
import CategoryDropdown from './CategoryDropdown';
import MobileCategoryMenu from './MobileCategoryMenu';
import fallbackCategories from '../data/categories';
import { apiEnabled } from '../data/business';
import { fetchPublicCategories } from '../utils/publicApi';

const SCROLL_THRESHOLD = 12;
const TOP_THRESHOLD = 5;

export default function CategoryNav({ activeFilter, onFilterChange }) {
  const [categories, setCategories] = useState(fallbackCategories);
  const [isVisible, setIsVisible] = useState(true);
  const shellRef = useRef(null);
  const visibleRef = useRef(true);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef(null);
  const directionDistance = useRef(0);
  const pointerInside = useRef(false);
  const mobileMenuOpen = useRef(false);

  useEffect(() => {
    if (!apiEnabled) return undefined;
    let active = true;
    fetchPublicCategories()
      .then(items => {
        if (!active || !items.length) return;
        const dynamicCategories = items.map(category => ({
          id: category.slug,
          label: category.name,
          icon: category.icon,
          subcategories: (category.subcategories || []).map(item => [item.slug, item.name]),
        }));
        setCategories([...dynamicCategories, { id: 'all', label: 'All Products', subcategories: [] }]);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const updateVisibility = useCallback(nextVisible => {
    if (visibleRef.current === nextVisible) return;
    visibleRef.current = nextVisible;
    setIsVisible(nextVisible);
  }, []);

  const handleMobileMenuOpenChange = useCallback(open => {
    mobileMenuOpen.current = open;
    if (open) updateVisibility(true);
  }, [updateVisibility]);

  useEffect(() => {
    lastScrollY.current = Math.max(window.scrollY, 0);
    let animationFrame = null;

    const isInteracting = () => {
      const desktopHasFocus = window.matchMedia('(min-width: 1241px)').matches
        && shellRef.current?.contains(document.activeElement);
      return pointerInside.current || mobileMenuOpen.current || desktopHasFocus;
    };

    const updateFromScroll = () => {
      animationFrame = null;
      const currentScrollY = Math.max(window.scrollY, 0);

      if (currentScrollY <= TOP_THRESHOLD) {
        updateVisibility(true);
        lastScrollY.current = currentScrollY;
        scrollDirection.current = null;
        directionDistance.current = 0;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;
      if (delta === 0) return;

      const nextDirection = delta > 0 ? 'down' : 'up';
      if (scrollDirection.current !== nextDirection) {
        scrollDirection.current = nextDirection;
        directionDistance.current = Math.abs(delta);
      } else {
        directionDistance.current += Math.abs(delta);
      }

      if (directionDistance.current < SCROLL_THRESHOLD) return;

      if (nextDirection === 'down') {
        if (!isInteracting()) updateVisibility(false);
      } else {
        updateVisibility(true);
      }
      directionDistance.current = 0;
    };

    const onScroll = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, [updateVisibility]);

  const selectCategory = filter => {
    onFilterChange(filter);
    window.requestAnimationFrame(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div
      ref={shellRef}
      className={`category-nav-shell${isVisible ? '' : ' is-hidden'}`}
      onMouseEnter={() => { pointerInside.current = true; }}
      onMouseLeave={() => { pointerInside.current = false; }}
    >
      <nav className="category-nav" aria-label="Product categories">
        <ul className="category-nav__list">
          {categories.map(category => (
            <CategoryDropdown
              key={category.id}
              category={category}
              activeFilter={activeFilter}
              onSelect={selectCategory}
            />
          ))}
        </ul>
        <MobileCategoryMenu
          categories={categories}
          activeFilter={activeFilter}
          onSelect={selectCategory}
          onOpenChange={handleMobileMenuOpenChange}
        />
      </nav>
    </div>
  );
}
