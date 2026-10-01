'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Search, User, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: Store },
    { href: '/shop', label: 'Search', icon: Search },
    { href: '/auth/login', label: 'Account', icon: User },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-brand-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-around items-center h-16 pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/shop' && pathname.startsWith('/shop'));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-brand-600' : 'text-brand-400 hover:text-brand-600'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.label === 'Cart' && isHydrated && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-1 ring-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
