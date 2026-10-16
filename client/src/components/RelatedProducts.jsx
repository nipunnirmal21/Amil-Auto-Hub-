import ProductCard from './ProductCard';

export default function RelatedProducts({ products }) {
  if (!products.length) return null;

  return (
    <section className="related-products" aria-labelledby="related-products-title">
      <div className="product-details-section-heading">
        <span>YOU MAY ALSO NEED</span>
        <h2 id="related-products-title">Related Products</h2>
      </div>
      <div className="product-grid">
        {products.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
