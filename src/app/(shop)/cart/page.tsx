'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  // Use selectors to subscribe to specific parts of the store
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = useCartStore((state) => state.subtotal);
  const [isLoaded, setIsLoaded] = useState(false);

  // Wait for the store to hydrate from localStorage
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-brand-600">Loading cart...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-brand-300 mb-4" />
        <h1 className="text-3xl font-bold text-brand-900 mb-2">Your cart is empty</h1>
        <p className="text-brand-600 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/shop">
          <Button size="lg">
            Start Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId || 'default'}`} className="flex gap-4 border-b border-brand-200 pb-6">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-brand-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between text-base font-medium text-brand-900">
                  <h3>{item.name}</h3>
                  <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                </div>
                
                {item.attributes && Object.keys(item.attributes).length > 0 && (
                  <p className="mt-1 text-sm text-brand-600">
                    {Object.entries(item.attributes).map(([key, value]) => (
                      <span key={key}>{key}: {value} </span>
                    ))}
                  </p>
                )}

                <div className="flex flex-1 items-end justify-between text-sm">
                  <div className="flex items-center border border-brand-300 rounded-md">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.variantId, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-brand-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="p-2 hover:bg-brand-50"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="rounded-lg bg-brand-50 p-6">
            <h2 className="text-lg font-medium text-brand-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-brand-600">Subtotal</p>
                <p className="text-lg font-bold text-brand-900">{formatCurrency(subtotal())}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p className="text-brand-600">Shipping</p>
                <p className="text-brand-600">Calculated at checkout</p>
              </div>
              <div className="border-t border-brand-200 pt-4 flex items-center justify-between">
                <p className="text-base font-medium text-brand-900">Total</p>
                <p className="text-xl font-bold text-brand-900">{formatCurrency(subtotal())}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/shop" className="block text-center text-sm text-brand-600 hover:text-brand-900">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
