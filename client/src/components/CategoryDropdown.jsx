import {
  Battery, CarFront, ChevronDown, CircleDot, Cog, Disc3, Droplets,
  Fan, Grid3X3, Lightbulb, ListFilter, SprayCan, Wrench, Zap,
} from 'lucide-react';

const categoryIcons = {
  'engine-oils': Droplets,
  filters: ListFilter,
  'brake-parts': Disc3,
  'suspension-parts': Wrench,
  'engine-parts': Cog,
  'electrical-parts': Zap,
  batteries: Battery,
  lighting: Lightbulb,
  'cooling-system': Fan,
  'vehicle-accessories': CarFront,
  'car-care': SprayCan,
  all: Grid3X3,
};

export default function CategoryDropdown({ category, activeFilter, onSelect }) {
  const isActive = activeFilter.categoryId === category.id;
  const hasChildren = category.subcategories.length > 0;
  const Icon = categoryIcons[category.id] || CircleDot;

  return (
    <li className={`category-dropdown${isActive ? ' is-active' : ''}`}>
      <button
        className="category-dropdown__trigger"
        type="button"
        onClick={() => onSelect({ categoryId: category.id, subcategoryId: null, label: category.label })}
        aria-haspopup={hasChildren ? 'true' : undefined}
      >
        <Icon className="category-dropdown__icon" size={21} strokeWidth={2.2} aria-hidden="true" />
        <span>{category.label}</span>
        {hasChildren && <ChevronDown className="category-dropdown__chevron" size={13} strokeWidth={2.5} aria-hidden="true" />}
      </button>

      {hasChildren && (
        <div className="category-dropdown__menu">
          <button
            type="button"
            className={!activeFilter.subcategoryId && isActive ? 'is-selected' : ''}
            onClick={() => onSelect({ categoryId: category.id, subcategoryId: null, label: category.label })}
          >
            Shop all {category.label}
          </button>
          {category.subcategories.map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={isActive && activeFilter.subcategoryId === id ? 'is-selected' : ''}
              onClick={() => onSelect({ categoryId: category.id, subcategoryId: id, label })}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
