import ProductCard from './ProductCard';

export default function ProductGrid({ products, expanded, emptyTitle = 'No products found.', className = '', startIndex = 0 }) {
  if (!products.length) {
    return (
      <div className="product-grid-empty" role="status">
        <strong>{emptyTitle}</strong>
        <span>Try another search or browse a different category.</span>
      </div>
    );
  }

  return (
    <div className={`product-grid ${className}`.trim()} aria-live="polite">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} isNew={expanded && index + startIndex >= 10} />
      ))}
    </div>
  );
}
