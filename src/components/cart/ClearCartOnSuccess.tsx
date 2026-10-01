'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export function ClearCartOnSuccess() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Automatically clear the cart when this page loads
    clearCart();
  }, [clearCart]);

  return null;
}
