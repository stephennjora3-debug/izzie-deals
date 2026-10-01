'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Plus, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { SearchInput } from './SearchInput';
import { UserMenu } from './UserMenu';
import { createClient } from '@/lib/supabase/client';
import { isAdmin } from '@/lib/admin';

function CartBadge() {
  const totalItems = useCartStore((state) => state.totalItems());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;
  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-900 text-[10px] font-bold text-white">
      {totalItems > 99 ? '99+' : totalItems}
    </span>
  );
}

export function Header() {
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && isAdmin(user.email)) {
        setIsAdminUser(true);
      }
    };
    checkAdmin();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/izzie.png" alt="Izzie Deals" className="h-12 md:h-14 lg:h-16 w-auto object-contain" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="text-sm font-medium text-brand-700 hover:text-brand-900">Shop</Link>
            <Link href="/shop?category=Clothing" className="text-sm font-medium text-brand-700 hover:text-brand-900">Clothing</Link>
            <Link href="/shop?category=Electronics" className="text-sm font-medium text-brand-700 hover:text-brand-900">Electronics</Link>
            <Link href="/shipping" className="text-sm font-medium text-brand-700 hover:text-brand-900">Shipping</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <SearchInput />
            
            {/* Admin Links */}
            {isAdminUser && (
              <div className="hidden md:flex items-center gap-2 border-l border-brand-200 pl-4">
                <Link 
                  href="/admin/orders" 
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-md transition-colors"
                >
                  <Package className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
                <Link 
                  href="/admin/add-product" 
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </Link>
              </div>
            )}

            {/* User Menu (Login/Logout) */}
            <UserMenu />

            {/* Cart */}
            <Link href="/cart" className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-brand-100 h-10 w-10">
              <ShoppingCart className="h-5 w-5" />
              <CartBadge />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
