import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <article className="cart-item">
      <div className="cart-item__image"><img src={item.image} alt="" /></div>
      <div className="cart-item__details">
        <div className="cart-item__heading">
          <div>
            <span>{item.brand}</span>
            <h3>{item.name}</h3>
          </div>
          <button type="button" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name} from cart`}>
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
        <p>{formatPrice(item.priceValue)} each</p>
        <div className="cart-item__bottom">
          <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
            <button type="button" onClick={() => decreaseQuantity(item.id)} disabled={item.quantity === 1} aria-label="Decrease quantity">
              <Minus size={15} aria-hidden="true" />
            </button>
            <span aria-live="polite">{item.quantity}</span>
            <button type="button" onClick={() => increaseQuantity(item.id)} aria-label="Increase quantity">
              <Plus size={15} aria-hidden="true" />
            </button>
          </div>
          <strong>{formatPrice(item.priceValue * item.quantity)}</strong>
        </div>
      </div>
    </article>
  );
}
