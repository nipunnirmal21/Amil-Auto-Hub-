import { formatPrice } from './formatPrice.js';

export function buildCartInquiry(cartItems, cartSubtotal, businessName = 'Amil Auto Hub') {
  return [
    `Hi ${businessName},`,
    'I would like to inquire about the following items:',
    ...cartItems.flatMap((item, index) => [
      `${index + 1}. ${item.name}`,
      `Qty: ${item.quantity}`,
      `Price: ${formatPrice(item.priceValue * item.quantity)}`,
      '',
    ]),
    `Subtotal: ${formatPrice(cartSubtotal)}`,
    '',
    'Please let me know about availability.',
  ].join('\n');
}

export function buildProductInquiry(product, businessName = 'Amil Auto Hub') {
  return [
    `Hi ${businessName},`,
    'I would like to know more about:',
    '',
    `Product: ${product.name}`,
    `Price: ${formatPrice(product.priceValue)}`,
    '',
    'Please let me know about availability and compatibility.',
  ].join('\n');
}

export function buildWhatsAppInquiryUrl(whatsappLink, message) {
  return `${whatsappLink}?text=${encodeURIComponent(message)}`;
}
