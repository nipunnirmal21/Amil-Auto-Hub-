import { useEffect } from 'react';
import { MessageCircle, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { business } from '../data/business';
import { formatPrice } from '../utils/formatPrice';
import { buildCartInquiry, buildWhatsAppInquiryUrl } from '../utils/cartInquiry';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { cartItems, cartCount, cartSubtotal, clearCart, isCartOpen, closeCart, toast } = useCart();

  useEffect(() => {
    if (!isCartOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = event => {
      if (event.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isCartOpen, closeCart]);

  const inquiryMessage = buildCartInquiry(cartItems, cartSubtotal, business.name);
  const inquiryUrl = buildWhatsAppInquiryUrl(business.whatsappLink, inquiryMessage);

  return (
    <>
      <div className={`cart-toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
      <div className={`cart-overlay${isCartOpen ? ' is-open' : ''}`} onClick={closeCart} aria-hidden="true" />
      <aside
        className={`cart-drawer${isCartOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-hidden={!isCartOpen}
        inert={!isCartOpen}
      >
        <header className="cart-drawer__header">
          <div>
            <span>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
            <h2 id="cart-title">Your Cart</h2>
          </div>
          <button type="button" onClick={closeCart} aria-label="Close cart">
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        {cartItems.length ? (
          <>
            <div className="cart-drawer__items">
              {cartItems.map(item => <CartItem key={item.id} item={item} />)}
            </div>
            <footer className="cart-drawer__footer">
              <div className="cart-subtotal"><span>Subtotal</span><strong>{formatPrice(cartSubtotal)}</strong></div>
              <p>Final availability will be confirmed through WhatsApp.</p>
              <a className="cart-inquiry-button" href={inquiryUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden="true" />Proceed to Inquiry
              </a>
              <button className="cart-clear-button" type="button" onClick={clearCart}>Clear Cart</button>
            </footer>
          </>
        ) : (
          <div className="cart-empty">
            <span><ShoppingCart size={30} aria-hidden="true" /></span>
            <h3>Your cart is empty.</h3>
            <p>Add some products to get started.</p>
            <button type="button" onClick={closeCart}>Continue browsing</button>
          </div>
        )}
      </aside>
    </>
  );
}
