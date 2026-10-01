'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function CartClearer() {
  useEffect(() => {
    console.log('CartClearer mounted. Clearing cart...');
    
    // 1. Clear Zustand state using the exact method from your store
    useCartStore.getState().clearCart();
    
    // 2. Nuke the specific localStorage key your store uses
    localStorage.removeItem('aura-cart-storage');
    
    console.log('Cart cleared successfully.');
  }, []);

  return null;
}
