import fs from 'fs';
import path from 'path';

console.log(' Updating grid layout to 5 columns per row (responsive)...\n');

// ==========================================
// 1. Update Product Card (Minimalist Style)
// ==========================================
const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');

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
    category?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Fallback image if none exists
  const imageUrl = product.image || 'https://via.placeholder.com/400x500?text=No+Image';

  return (
    <div className="group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
        <Link href={\`/product/\${product.id}\`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        </Link>
        
        {/* Wishlist Button (Top Right) */}
        <button 
          onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        >
          <Heart className={\`w-4 h-4 transition-colors \${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}\`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        <Link href={\`/product/\${product.id}\`} className="flex-grow">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-brand-900 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto">
          <p className="text-base font-bold text-gray-900">
            {formatCurrency(product.price, 'KES')}
          </p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(productCardPath, cardCode, 'utf8');
console.log('✅ Updated ProductCard with minimalist design.');

// ==========================================
// 2. Update Shop Page (5-Column Grid)
// ==========================================
// Try both common paths for the shop page
const shopPaths = [
  path.join('src', 'app', '(shop)', 'page.tsx'),
  path.join('src', 'app', 'shop', 'page.tsx')
];

const shopCode = `import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product/ProductCard';

async function ShopContent() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return <div className="text-center py-12 text-red-500">Error loading products.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header Section */}
      <div className="border-b border-gray-100 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shop All Products
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover our curated collection of premium goods.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{products?.length || 0}</span> results
          </p>
        </div>

        {/* THE GRID: 2 cols mobile, 3 tablet, 4 laptop, 5 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products?.map((product: any) => (
            <ProductCard 
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.base_price,
                // Handle different image column names safely
                image: product.images?.[0] || product.image_url || product.image || '',
                category: product.category
              }}
            />
          ))}
        </div>

        {(!products || products.length === 0) && (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white">Loading products...</div>}>
      <ShopContent />
    </Suspense>
  );
}
`;

let pathUsed = null;
for (const p of shopPaths) {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, shopCode, 'utf8');
    pathUsed = p;
    break;
  }
}

if (pathUsed) {
  console.log('✅ Updated Shop page with 5-column responsive grid at:', pathUsed);
} else {
  console.log('⚠️ Could not find shop page. Please check src/app/(shop)/page.tsx or src/app/shop/page.tsx');
}

console.log('\n🎉 Grid layout updated!');