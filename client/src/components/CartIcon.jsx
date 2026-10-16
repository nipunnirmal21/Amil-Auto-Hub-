import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartIcon({ className = '' }) {
  const { cartCount, openCart } = useCart();

  return (
    <button
      className={`cart-button ${className}`.trim()}
      type="button"
      onClick={openCart}
      aria-label={`Open cart with ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
    >
      <ShoppingCart size={20} aria-hidden="true" />
      {cartCount > 0 && <span className="cart-button__badge">{cartCount > 99 ? '99+' : cartCount}</span>}
    </button>
  );
}
