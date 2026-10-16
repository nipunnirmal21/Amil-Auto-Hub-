import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Grid2X2, X } from 'lucide-react';

export default function MobileCategoryMenu({ categories, activeFilter, onSelect, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    const closeOnEscape = event => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [closeMenu]);

  const select = filter => {
    onSelect(filter);
    closeMenu();
  };

  const toggleMenu = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <div className="mobile-category-nav">
      <button
        className="mobile-category-nav__toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-category-list"
        onClick={toggleMenu}
      >
        <span><Grid2X2 size={17} aria-hidden="true" />Browse Categories</span>
        <span className="mobile-category-nav__current">{activeFilter.label}</span>
        {open ? <X size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
      </button>

      <div id="mobile-category-list" className={`mobile-category-nav__panel${open ? ' is-open' : ''}`}>
        <ul>
          {categories.map(category => {
            const hasChildren = category.subcategories.length > 0;
            const expanded = expandedCategory === category.id;
            const active = activeFilter.categoryId === category.id;
            return (
              <li key={category.id} className={active ? 'is-active' : ''}>
                <div className="mobile-category-nav__row">
                  <button
                    type="button"
                    onClick={() => select({ categoryId: category.id, subcategoryId: null, label: category.label })}
                  >
                    {category.label}
                  </button>
                  {hasChildren && (
                    <button
                      type="button"
                      className="mobile-category-nav__expand"
                      aria-label={`${expanded ? 'Collapse' : 'Expand'} ${category.label}`}
                      aria-expanded={expanded}
                      onClick={() => setExpandedCategory(expanded ? null : category.id)}
                    >
                      <ChevronDown size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
                {hasChildren && (
                  <div className={`mobile-category-nav__subcategories${expanded ? ' is-open' : ''}`}>
                    <div>
                      {category.subcategories.map(([id, label]) => (
                        <button
                          type="button"
                          key={id}
                          className={active && activeFilter.subcategoryId === id ? 'is-selected' : ''}
                          onClick={() => select({ categoryId: category.id, subcategoryId: id, label })}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
