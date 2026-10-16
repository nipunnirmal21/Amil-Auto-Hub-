import { useState } from 'react';
import { CheckCircle2, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, isNew = false }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className={`product-card${isNew ? ' product-card--new' : ''}`}>
      <div className="product-image-wrap">
        {product.featured && <span className="featured-ribbon">Popular</span>}
        <button
          className={`wishlist-button${wishlisted ? ' is-active' : ''}`}
          type="button"
          aria-label={`${wishlisted ? 'Remove' : 'Add'} ${product.name} ${wishlisted ? 'from' : 'to'} wishlist`}
          aria-pressed={wishlisted}
          onClick={() => setWishlisted(value => !value)}
        >
          <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <img src={product.image} alt="" loading="lazy" />
      </div>

      <div className="product-card__content">
        <span className="brand-badge">{product.brand}</span>
        <h3>{product.name}</h3>
        <strong className="product-price">{product.price}</strong>
        <div className="product-meta">
          <span className={`stock-badge${product.stockStatus === 'Low Stock' ? ' low' : ''}`}>
            <CheckCircle2 size={14} aria-hidden="true" />{product.stockStatus}
          </span>
          <span className="product-category">{product.category}</span>
        </div>
      </div>

      <div className="product-actions">
        <button className={`product-button primary${added ? ' is-added' : ''}`} type="button" onClick={handleAddToCart}>
          <ShoppingCart size={16} /> <span>{added ? 'Added' : 'Add to Cart'}</span>
        </button>
        <Link className="product-button secondary" to={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
          <span>View Details</span>
        </Link>
      </div>
    </article>
  );
}
