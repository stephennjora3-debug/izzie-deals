'use client';

import Link from 'next/link';
import { Search, ShoppingCart, MapPin, Menu, ChevronDown, User, Package } from 'lucide-react';
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
    <span className="absolute top-0 right-2 md:right-3 flex h-5 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-[#00A651]">
      {totalItems > 99 ? '99+' : totalItems}
    </span>
  );
}

export function Header() {
  const [isAdminUser, setIsAdminUser] = useState(false);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full flex flex-col">
      {/* --- TOP SAFARICOM GREEN BAR --- */}
      <div className="bg-[#00A651] text-white py-2 px-4 md:px-8">
        <div className="max-w-[1500px] mx-auto flex items-center gap-4 md:gap-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 border border-transparent hover:border-white rounded p-1 transition-all">
            <img src="/izzie.png" alt="Izzie Deals" className="h-8 md:h-10 w-auto object-contain bg-white rounded px-2 py-1" />
          </Link>

          {/* Deliver To (Hidden on small mobile) */}
          <div className="hidden md:flex flex-col items-start border border-transparent hover:border-white rounded p-1 cursor-pointer transition-all">
            <span className="text-[11px] text-green-100 ml-4">Deliver to</span>
            <div className="flex items-center font-bold text-sm text-white">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Kenya</span>
            </div>
          </div>

          {/* Massive Search Bar */}
          <form onSubmit={handleSearch} className="flex-grow flex h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-white transition-all">
            <select className="hidden md:block bg-gray-100 text-gray-700 text-xs px-2 border-r border-gray-300 focus:outline-none cursor-pointer hover:bg-gray-200">
              <option>All</option>
              <option>Clothing</option>
              <option>Electronics</option>
              <option>Home</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Izzie Deals"
              className="flex-grow px-3 text-black focus:outline-none bg-white"
            />
            <button type="submit" className="bg-white hover:bg-gray-100 px-4 md:px-5 flex items-center justify-center transition-colors">
              <Search className="h-5 w-5 text-[#00A651]" />
            </button>
          </form>

          {/* Account & Lists */}
          <div className="hidden md:flex flex-col border border-transparent hover:border-white rounded p-1 cursor-pointer transition-all relative group">
            <span className="text-[11px] text-green-100">Hello, sign in</span>
            <span className="text-sm font-bold flex items-center text-white">Account & Lists <ChevronDown className="h-3 w-3 ml-1" /></span>
            {/* Dropdown placeholder */}
            <div className="absolute top-full right-0 w-64 bg-white text-black rounded-md shadow-xl p-4 hidden group-hover:block z-50">
               <UserMenu />
            </div>
          </div>

          {/* Returns & Orders (Desktop) */}
          <Link href="/admin/orders" className="hidden md:flex flex-col border border-transparent hover:border-white rounded p-1 transition-all">
            <span className="text-[11px] text-green-100">Returns</span>
            <span className="text-sm font-bold text-white">& Orders</span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="flex items-end border border-transparent hover:border-white rounded p-1 transition-all relative">
            <div className="relative">
              <ShoppingCart className="h-8 w-8 text-white" />
              <CartBadge />
            </div>
            <span className="font-bold text-sm mb-1 hidden md:inline text-white">Cart</span>
          </Link>
        </div>
      </div>

      {/* --- BOTTOM NAV BAR (Darker Safaricom Green) --- */}
      <div className="bg-[#007A3D] text-white text-sm py-2 px-4 md:px-8 flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button className="flex items-center gap-1 font-bold border border-transparent hover:border-white rounded px-2 py-1 transition-all flex-shrink-0 text-white">
          <Menu className="h-5 w-5" /> All
        </button>
        <Link href="/shop" className="border border-transparent hover:border-white rounded px-2 py-1 transition-all flex-shrink-0 text-white">Today's Deals</Link>
        <Link href="/shop?category=Clothing" className="border border-transparent hover:border-white rounded px-2 py-1 transition-all flex-shrink-0 text-white">Clothing</Link>
        <Link href="/shop?category=Electronics" className="border border-transparent hover:border-white rounded px-2 py-1 transition-all flex-shrink-0 text-white">Electronics</Link>
        <Link href="/shipping" className="border border-transparent hover:border-white rounded px-2 py-1 transition-all flex-shrink-0 text-white">Customer Service</Link>
        <Link href="/shop" className="border border-transparent hover:border-white rounded px-2 py-1 transition-all flex-shrink-0 text-white">Registry</Link>
        <Link href="/shop" className="border border-transparent hover:border-white rounded px-2 py-1 transition-all flex-shrink-0 text-white">Gift Cards</Link>
        <Link href="/shop" className="border border-transparent hover:border-white rounded px-2 py-1 transition-all flex-shrink-0 text-white">Sell</Link>
        
        {isAdminUser && (
           <Link href="/admin/add-product" className="border border-transparent hover:border-white rounded px-2 py-1 transition-all flex-shrink-0 text-yellow-300 font-bold">Admin: Add Product</Link>
        )}
      </div>
    </header>
  );
}
