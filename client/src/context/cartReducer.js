export const CART_STORAGE_KEY = 'amilAutoHubCart';

export const initialCartState = { items: [] };

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const quantity = Math.max(1, Math.floor(Number(action.quantity) || 1));
      const existing = state.items.find(item => item.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map(item => item.id === action.product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item),
        };
      }
      return { items: [...state.items, { ...action.product, quantity }] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(item => item.id !== action.productId) };
    case 'INCREASE_QUANTITY':
      return {
        items: state.items.map(item => item.id === action.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item),
      };
    case 'DECREASE_QUANTITY':
      return {
        items: state.items.map(item => item.id === action.productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item),
      };
    case 'CLEAR_CART':
      return initialCartState;
    default:
      return state;
  }
}

export function loadStoredCart(storage) {
  if (!storage) return initialCartState;
  try {
    const parsed = JSON.parse(storage.getItem(CART_STORAGE_KEY));
    if (!Array.isArray(parsed)) return initialCartState;
    const items = parsed.filter(item => (
      item &&
      (typeof item.id === 'number' || typeof item.id === 'string') &&
      typeof item.name === 'string' &&
      Number.isFinite(item.priceValue)
    )).map(item => ({ ...item, quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)) }));
    return { items };
  } catch {
    return initialCartState;
  }
}
