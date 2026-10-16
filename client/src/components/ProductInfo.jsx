import { Minus, MessageCircle, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { business } from '../data/business';
import { buildProductInquiry, buildWhatsAppInquiryUrl } from '../utils/cartInquiry';
import { formatPrice } from '../utils/formatPrice';

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const whatsappUrl = useMemo(
    () => buildWhatsAppInquiryUrl(business.whatsappLink, buildProductInquiry(product, business.name)),
    [product],
  );

  useEffect(() => setQuantity(1), [product.id]);

  const addSelectedQuantity = () => addToCart(product, quantity);
  const stockClass = product.stockStatus.toLowerCase().replaceAll(' ', '-');

  return (
    <div className="product-details-info">
      <div className="product-details-info__labels">
        <span>{product.brand}</span>
        <span>{product.category}</span>
      </div>
      <h1 id="product-title">{product.name}</h1>
      <strong className="product-details-price">{formatPrice(product.priceValue)}</strong>
      <div className={`product-details-stock ${stockClass}`}>
        <span aria-hidden="true" />{product.stockStatus}
      </div>
      <p className="product-details-summary">{product.shortDescription}</p>
      {product.partNumber && (
        <p className="product-details-sku"><span>Part number / SKU</span>{product.partNumber}</p>
      )}

      <div className="product-purchase-controls">
        <div className="product-quantity">
          <span>Quantity</span>
          <div className="quantity-control" aria-label="Product quantity">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity === 1}
              onClick={() => setQuantity(value => Math.max(1, value - 1))}
            >
              <Minus size={16} />
            </button>
            <span aria-live="polite">{quantity}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(value => value + 1)}>
              <Plus size={16} />
            </button>
          </div>
        </div>
        <button className="product-details-add" type="button" onClick={addSelectedQuantity}>
          <ShoppingCart size={19} /> Add to Cart
        </button>
      </div>

      <a className="product-details-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={19} /> Ask on WhatsApp
      </a>
      <p className="product-details-note">Availability and compatibility should be confirmed before ordering.</p>
    </div>
  );
}
