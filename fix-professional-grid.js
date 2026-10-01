import fs from 'fs';
import path from 'path';

console.log('🔧 Creating professional responsive product grid layout...\n');

// Update the Shop Page
const shopPath = path.join('src', 'app', 'shop', 'page.tsx');

if (fs.existsSync(shopPath)) {
  let code = fs.readFileSync(shopPath, 'utf8');
  
  const shopCode = `'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { Suspense } from 'react';

function ShopContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // This would normally fetch from your API/database
  // For now, we're using the existing structure
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-brand-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Shop All Products
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our curated collection of premium goods.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Hidden on mobile, shown on lg screens */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar 
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategory={category || 'All'}
            />
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button 
              className="w-full bg-brand-900 text-white px-4 py-3 rounded-lg font-medium"
              onClick={() => {/* Toggle mobile filter modal */}}
            >
              Filter & Sort
            </button>
          </div>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-brand-900">3</span> results
              </p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Products will be mapped here */}
              <ProductCard 
                product={{
                  id: '1',
                  name: 'Cesello Black Genuine shoe',
                  price: 15000,
                  image: '/products/shoe1.jpg',
                  category: 'Shoes'
                }}
              />
              <ProductCard 
                product={{
                  id: '2',
                  name: 'Premium Cotton T-Shirt',
                  price: 2500,
                  image: '/products/tshirt1.jpg',
                  category: 'Clothing'
                }}
              />
              <ProductCard 
                product={{
                  id: '3',
                  name: 'Wireless Headphones',
                  price: 3500,
                  image: '/products/headphones1.jpg',
                  category: 'Electronics'
                }}
              />
            </div>

            {/* Load More Button */}
            <div className="mt-12 text-center">
              <button className="bg-brand-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-800 transition-colors">
                Load More Products
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
`;

  fs.writeFileSync(shopPath, shopCode, 'utf8');
  console.log('✅ Updated Shop page with professional responsive grid.');
} else {
  console.log('️ Shop page not found at expected location.');
}

// Update Product Card Component
const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');

if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  const cardCode = `'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={\`/product/\${product.id}\`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        </Link>
        
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={\`p-2 rounded-full shadow-md transition-all \${
              isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
            }\`}
          >
            <Heart className={\`w-5 h-5 \${isLiked ? 'fill-current' : ''}\`} />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-brand-900 text-white text-xs font-medium px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={\`/product/\${product.id}\`}>
          <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 hover:text-brand-900 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-brand-900">
            {formatCurrency(product.price, 'KES')}
          </span>
          
          <button className="bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(productCardPath, cardCode, 'utf8');
  console.log('✅ Updated ProductCard with professional design.');
} else {
  console.log('⚠️ ProductCard component not found.');
}

console.log('\\n🎉 Professional grid layout created!');