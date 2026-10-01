import fs from 'fs';
import path from 'path';

console.log('🔧 Adding horizontal scrolling recent products to homepage...\n');

// 1. Create the HorizontalScrollingProducts component
const componentsDir = path.join('src', 'components', 'home');
fs.mkdirSync(componentsDir, { recursive: true });

const scrollingComponentPath = path.join(componentsDir, 'HorizontalScrollingProducts.tsx');
const componentCode = `'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProductCard } from '@/components/product/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HorizontalScrollingProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useState<HTMLDivElement | null>(null);

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
    if (scrollContainerRef[0]) {
      const scrollAmount = 300;
      scrollContainerRef[0].scrollBy({
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
            {[...Array(6)].map((_, i) => (
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
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef[0] ? null : (scrollContainerRef[0] = null) || true}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
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

fs.writeFileSync(scrollingComponentPath, componentCode, 'utf8');
console.log('✅ Created HorizontalScrollingProducts component.');

// 2. Update the home page to include this component
const homePaths = [
  path.join('src', 'app', 'page.tsx'),
  path.join('src', 'app', '(shop)', 'page.tsx')
];

const homeCode = `import { Suspense } from 'react';
import { HorizontalScrollingProducts } from '@/components/home/HorizontalScrollingProducts';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-brand-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Welcome to Izzie Deals
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Premium multi-category store offering curated clothing, electronics, and home goods.
          </p>
          <Link 
            href="/shop"
            className="inline-block bg-white text-brand-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Recently Added Products - Horizontal Scroll */}
      <Suspense fallback={<div className="py-12 text-center">Loading...</div>}>
        <HorizontalScrollingProducts />
      </Suspense>

      {/* Categories Section */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Clothing', 'Electronics', 'Accessories', 'Shoes', 'Home', 'All Products'].map((category) => (
              <Link
                key={category}
                href={category === 'All Products' ? '/shop' : \`/shop?category=\${encodeURIComponent(category)}\`}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-brand-500 hover:shadow-lg transition-all"
              >
                <span className="font-medium text-brand-900">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

let updated = false;
for (const homePath of homePaths) {
  if (fs.existsSync(homePath)) {
    fs.writeFileSync(homePath, homeCode, 'utf8');
    console.log('✅ Updated home page at:', homePath);
    updated = true;
    break;
  }
}

if (!updated) {
  console.log('️ Could not find home page. Creating one...');
  const newHomePath = path.join('src', 'app', 'page.tsx');
  fs.writeFileSync(newHomePath, homeCode, 'utf8');
  console.log('✅ Created new home page at:', newHomePath);
}

console.log('\\n🎉 Homepage with horizontal scrolling products added!');