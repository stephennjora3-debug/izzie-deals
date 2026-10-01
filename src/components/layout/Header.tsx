'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Plus, Package, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { UserMenu } from './UserMenu';
import { createClient } from '@/lib/supabase/client';
import { isAdmin } from '@/lib/admin';
import { useRouter } from 'next/navigation';

function CartBadge() {
  const totalItems = useCartStore((state) => state.totalItems());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;
  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
      {totalItems > 99 ? '99+' : totalItems}
    </span>
  );
}

export function Header() {
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

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

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* 1. TOP NOTIFICATION BAR */}
      <div className="bg-brand-900 text-white text-xs md:text-sm py-2 text-center px-4">
        <p className="font-medium tracking-wide">
          Free shipping on orders over KES 5,000 | Call us: +254 700 000 000
        </p>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-brand-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            
            {/* Left: Mobile Menu Toggle & Logo */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 text-brand-900 hover:bg-brand-50 rounded-md transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center">
                <img src="/izzie.png" alt="Izzie Deals" className="h-10 md:h-12 w-auto object-contain" />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/shop" className="text-sm font-semibold text-brand-900 hover:text-brand-600 transition-colors">Shop</Link>
              <Link href="/shop?category=Clothing" className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors">Clothing</Link>
              <Link href="/shop?category=Electronics" className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors">Electronics</Link>
              <Link href="/shipping" className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors">Shipping</Link>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              {/* Desktop Search */}
              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="flex h-10 w-64 rounded-full border border-brand-200 bg-brand-50 px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900 focus:bg-white transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim().length >= 3) {
                      router.push(`/shop?search=${encodeURIComponent((e.target as HTMLInputElement).value.trim())}`);
                    }
                  }}
                />
              </div>

              {/* User Menu (Desktop) */}
              <div className="hidden md:block">
                <UserMenu />
              </div>

              {/* Cart */}
              <Link href="/cart" className="relative inline-flex items-center justify-center rounded-full text-brand-900 hover:bg-brand-50 h-10 w-10 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                <CartBadge />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MOBILE SLIDE-OUT DRAWER (OFFCANVAS) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Slide-out Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-100">
              <img src="/izzie.png" alt="Izzie Deals" className="h-8 w-auto object-contain" />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-brand-500 hover:bg-brand-50 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleMobileSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-400" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="flex h-12 w-full rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 pl-10 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1">
                <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">Shop</p>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-3 text-base font-medium text-brand-900 hover:bg-brand-50 rounded-lg transition-colors">All Products</Link>
                <Link href="/shop?category=Clothing" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-3 text-base font-medium text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">Clothing</Link>
                <Link href="/shop?category=Electronics" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-3 text-base font-medium text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">Electronics</Link>
                <Link href="/shipping" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-3 text-base font-medium text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">Shipping Info</Link>
              </nav>

              {/* Mobile Admin Links */}
              {isAdminUser && (
                <div className="pt-4 border-t border-brand-100 space-y-1">
                  <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">Admin</p>
                  <Link href="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-base font-medium text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                    <Package className="h-5 w-5" /> Orders
                  </Link>
                  <Link href="/admin/add-product" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-base font-medium text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                    <Plus className="h-5 w-5" /> Add Product
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Footer (User Menu) */}
            <div className="p-4 border-t border-brand-100 bg-brand-50">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
