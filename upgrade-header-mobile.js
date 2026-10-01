import fs from 'fs';
import path from 'path';

const headerPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Header.tsx');

console.log('Upgrading Header to professional mobile-responsive layout...\n');

const newHeader = `'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Plus, Package, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { UserMenu } from './UserMenu';
import { createClient } from '@/lib/supabase/client';
import { isAdmin } from '@/lib/admin';
import { useRouter, usePathname } from 'next/navigation';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

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

  // Handle mobile search submission
  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      router.push(\`/shop?search=\${encodeURIComponent(searchQuery.trim())}\`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-brand-200 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <img src="/izzie.png" alt="Izzie Deals" className="h-10 md:h-12 lg:h-14 w-auto object-contain" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/shop" className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors">Shop</Link>
              <Link href="/shop?category=Clothing" className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors">Clothing</Link>
              <Link href="/shop?category=Electronics" className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors">Electronics</Link>
              <Link href="/shipping" className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors">Shipping</Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="flex h-10 w-64 rounded-md border border-brand-200 bg-white px-3 py-2 pl-9 text-sm ring-offset-white placeholder:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim().length >= 3) {
                      router.push(\`/shop?search=\${encodeURIComponent((e.target as HTMLInputElement).value.trim())}\`);
                    }
                  }}
                />
              </div>

              {/* User Menu */}
              <div className="hidden md:block">
                <UserMenu />
              </div>

              {/* Cart */}
              <Link href="/cart" className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-brand-100 h-10 w-10">
                <ShoppingCart className="h-5 w-5" />
                <CartBadge />
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-brand-100 h-10 w-10 text-brand-700"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-16 left-0 right-0 bg-white border-b border-brand-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto px-4 py-6 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleMobileSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-400" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="flex h-12 w-full rounded-md border border-brand-200 bg-white px-3 py-2 pl-10 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-4">
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-brand-900 hover:text-brand-600">Shop All</Link>
                <Link href="/shop?category=Clothing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-brand-900 hover:text-brand-600">Clothing</Link>
                <Link href="/shop?category=Electronics" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-brand-900 hover:text-brand-600">Electronics</Link>
                <Link href="/shipping" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-brand-900 hover:text-brand-600">Shipping Info</Link>
              </nav>

              {/* Mobile Admin Links */}
              {isAdminUser && (
                <div className="pt-4 border-t border-brand-200 space-y-4">
                  <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Admin</p>
                  <Link href="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-base font-medium text-brand-700 hover:text-brand-900">
                    <Package className="h-5 w-5" /> Orders
                  </Link>
                  <Link href="/admin/add-product" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-base font-medium text-brand-700 hover:text-brand-900">
                    <Plus className="h-5 w-5" /> Add Product
                  </Link>
                </div>
              )}

              {/* Mobile User Menu Placeholder (Login/Logout) */}
              <div className="pt-4 border-t border-brand-200">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
`;

fs.writeFileSync(headerPath, newHeader, 'utf8');

console.log('✅ SUCCESS: Header upgraded with professional mobile responsiveness!');
console.log('   - Added a smooth mobile menu (hamburger) with search and navigation.');
console.log('   - Desktop layout remains clean and spacious.');
console.log('   - Search now works beautifully on both mobile and desktop.');