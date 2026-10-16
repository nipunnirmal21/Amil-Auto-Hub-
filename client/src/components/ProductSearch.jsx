import { Search, X } from 'lucide-react';

export default function ProductSearch({ value, onChange }) {
  return (
    <div className="product-search" role="search">
      <Search className="product-search__icon" size={17} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="Search products..."
        aria-label="Search products by name, category, or brand"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear product search">
          <X size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
