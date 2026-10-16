import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, X } from 'lucide-react';
import DailyBoard from '../components/DailyBoard';
import ProductGrid from '../components/ProductGrid';
import { apiEnabled } from '../data/business';
import demoProducts from '../data/demoProducts';
import { fetchPublicProducts } from '../utils/publicApi';

const INITIAL_VISIBLE_PRODUCT_COUNT = 9;

export default function Products({ activeFilter, searchTerm, onResetFilter }) {
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState(demoProducts);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!apiEnabled) return undefined;
    let active = true;
    fetchPublicProducts()
      .then(items => { if (active) setProducts(items); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const categoryProducts = activeFilter.categoryId === 'all'
    ? products
    : products.filter(product => activeFilter.subcategoryId
      ? product.subcategoryIds.includes(`${activeFilter.categoryId}:${activeFilter.subcategoryId}`)
      : product.categoryIds.includes(activeFilter.categoryId));
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? categoryProducts.filter(product => [product.name, product.category, product.brand]
      .some(value => String(value || '').toLowerCase().includes(normalizedSearch)))
    : categoryProducts;
  const visibleProducts = expanded
    ? filteredProducts
    : filteredProducts.slice(0, INITIAL_VISIBLE_PRODUCT_COUNT);
  const featuredProducts = visibleProducts.slice(0, 4);
  const remainingProducts = visibleProducts.slice(4);

  useEffect(() => setExpanded(false), [activeFilter.categoryId, activeFilter.subcategoryId, normalizedSearch]);

  const toggleProducts = () => {
    if (expanded) {
      setExpanded(false);
      window.requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    setExpanded(true);
  };

  return (
    <section id="products" className="section products-section" ref={sectionRef}>
      <div className="container product-showcase">
        <header className="product-section-heading product-section-heading--marketplace">
          <div>
            <p className="eyebrow red"><span />OUR PRODUCTS</p>
            <h2>Featured Products</h2>
          </div>
          <button
            className="view-all-products"
            type="button"
            onClick={() => setExpanded(true)}
            disabled={expanded || filteredProducts.length <= INITIAL_VISIBLE_PRODUCT_COUNT}
          >
            View All Products <ArrowRight size={17} />
          </button>
        </header>

        {activeFilter.categoryId !== 'all' && (
          <div className="active-product-filter" role="status">
            <span>Showing: <strong>{activeFilter.label}</strong></span>
            <button type="button" onClick={onResetFilter}>
              Clear filter <X size={14} aria-hidden="true" />
            </button>
          </div>
        )}

        {visibleProducts.length ? (
          <>
            <div className="board-product-layout">
              <DailyBoard />
              <ProductGrid
                products={featuredProducts}
                expanded={expanded}
                className="featured-product-grid"
              />
            </div>
            {remainingProducts.length > 0 && (
              <ProductGrid
                products={remainingProducts}
                expanded={expanded}
                className="product-grid--continuation"
                startIndex={4}
              />
            )}
          </>
        ) : (
          <ProductGrid
            products={visibleProducts}
            expanded={expanded}
            emptyTitle={normalizedSearch ? 'No products found.' : 'No products found in this category.'}
          />
        )}

        {filteredProducts.length > 0 && (
          <div className="product-toggle-wrap">
            {filteredProducts.length > INITIAL_VISIBLE_PRODUCT_COUNT && (
              <button className="product-toggle" type="button" onClick={toggleProducts} aria-expanded={expanded}>
                {expanded ? 'Show Less' : 'See More Products'}
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            )}
            <span>{visibleProducts.length} of {filteredProducts.length} products</span>
          </div>
        )}
      </div>
    </section>
  );
}
