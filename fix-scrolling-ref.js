import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing useRef error in HorizontalScrollingProducts...\n');

const componentPath = path.join('src', 'components', 'home', 'HorizontalScrollingProducts.tsx');

const fixedCode = `'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProductCard } from '@/components/product/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HorizontalScrollingProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // CORRECT WAY: Use useRef for DOM elements
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchRecentProducts();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-6">Recently Added</h2>
          <div className="flex gap-4 overflow-x-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 h-80 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900">Recently Added</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CORRECT REF USAGE HERE */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 md:w-72">
              <ProductCard 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.base_price,
                  image: product.images?.[0] || product.image_url || '',
                  category: product.category
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(componentPath, fixedCode, 'utf8');
console.log('✅ Fixed HorizontalScrollingProducts to use useRef correctly.');
console.log('🎉 The scrolling section will now work perfectly!');