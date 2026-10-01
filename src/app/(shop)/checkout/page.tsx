'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { createOrder, ShippingDetails } from '@/actions/order.actions';

// All 47 counties in Kenya
const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', "Murang'a", 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '', // Will be used for County selection
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const cartItems = items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      await createOrder(cartItems, shipping);
      // Clear cart immediately after successful order
      clearCart();
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout.');
      setIsSubmitting(false);
    }
  };

  // Redirect to cart if empty, but do it in useEffect to avoid render-phase state updates
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-brand-600">Redirecting to cart...</p>
      </div>
    );
  }

  const shippingFee = 200;
  const total = subtotal() + shippingFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Shipping Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-brand-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-700 mb-1">Full Name</label>
                  <Input 
                    required 
                    value={shipping.fullName} 
                    onChange={e => setShipping({...shipping, fullName: e.target.value})} 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-700 mb-1">Phone Number</label>
                  <Input 
                    required 
                    type="tel" 
                    placeholder="07XX XXX XXX" 
                    value={shipping.phone} 
                    onChange={e => setShipping({...shipping, phone: e.target.value})} 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-700 mb-1">Street Address</label>
                  <Input 
                    required 
                    value={shipping.addressLine1} 
                    onChange={e => setShipping({...shipping, addressLine1: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">County</label>
                  <select 
                    required
                    className="w-full px-3 py-2 border border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-brand-900"
                    value={shipping.city}
                    onChange={e => setShipping({...shipping, city: e.target.value})}
                  >
                    <option value="" disabled>Select County</option>
                    {KENYA_COUNTIES.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Country</label>
                  <Input disabled value="Kenya" />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : `Place Order (KES ${total.toLocaleString()})`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="rounded-lg bg-brand-50 p-6 sticky top-24">
            <h2 className="text-lg font-medium text-brand-900 mb-4">Order Summary</h2>
            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-brand-900">{item.name}</p>
                    <p className="text-brand-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-brand-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-brand-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-600">Subtotal</span>
                <span>{formatCurrency(subtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-600">Shipping (Nairobi)</span>
                <span>{formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-brand-900 pt-2 border-t border-brand-200">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
