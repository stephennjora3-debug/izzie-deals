import fs from 'fs';
import path from 'path';

const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');

const cleanHeader = `'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Plus, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { SearchInput } from './SearchInput';

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
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-brand-900">
            Aura
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="text-sm font-medium text-brand-700 hover:text-brand-900">Shop</Link>
            <Link href="/shop?category=Clothing" className="text-sm font-medium text-brand-700 hover:text-brand-900">Clothing</Link>
            <Link href="/shop?category=Electronics" className="text-sm font-medium text-brand-700 hover:text-brand-900">Electronics</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <SearchInput />
            
            {/* Admin Links */}
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

            {/* User Account */}
            <Link href="/account" className="text-brand-700 hover:text-brand-900">
              <User className="h-5 w-5" />
            </Link>

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
`;

fs.writeFileSync(headerPath, cleanHeader, 'utf8');
console.log('Header rebuilt successfully with Orders and Add Product links.');