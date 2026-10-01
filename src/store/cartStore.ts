import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  attributes?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(
          (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
        );

        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item.productId === newItem.productId && item.variantId === newItem.variantId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          };
        }

        return { items: [...state.items, newItem] };
      }),

      removeItem: (productId, variantId) => set((state) => ({
        items: state.items.filter(
          (item) => !(item.productId === productId && item.variantId === variantId)
        ),
      })),

      updateQuantity: (productId, variantId, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item
        ),
      })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      subtotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'aura-cart-storage', // name of the item in localStorage
    }
  )
);
