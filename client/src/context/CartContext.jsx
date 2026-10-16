import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { CART_STORAGE_KEY, cartReducer, initialCartState, loadStoredCart } from './cartReducer';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    () => loadStoredCart(typeof window === 'undefined' ? null : window.localStorage),
  );
  const [isCartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // The cart remains usable for this visit if storage is unavailable.
    }
  }, [state.items]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const notify = useCallback(message => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(''), 1800);
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    dispatch({ type: 'ADD_ITEM', product, quantity: safeQuantity });
    notify(safeQuantity > 1 ? `Added ${safeQuantity} to cart` : 'Added to cart');
  }, [notify]);

  const removeFromCart = useCallback(productId => {
    dispatch({ type: 'REMOVE_ITEM', productId });
    notify('Removed from cart');
  }, [notify]);

  const increaseQuantity = useCallback(productId => dispatch({ type: 'INCREASE_QUANTITY', productId }), []);
  const decreaseQuantity = useCallback(productId => dispatch({ type: 'DECREASE_QUANTITY', productId }), []);
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    notify('Cart cleared');
  }, [notify]);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const cartCount = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items],
  );
  const cartSubtotal = useMemo(
    () => state.items.reduce((total, item) => total + item.priceValue * item.quantity, 0),
    [state.items],
  );

  const value = useMemo(() => ({
    cartItems: state.items,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    toast,
  }), [state.items, cartCount, cartSubtotal, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, isCartOpen, openCart, closeCart, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
