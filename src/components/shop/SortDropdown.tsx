'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'featured';
  const currentCategory = searchParams.get('category') || 'All';

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select 
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="appearance-none bg-white border border-brand-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent cursor-pointer"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest Arrivals</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-500 pointer-events-none" />
    </div>
  );
}