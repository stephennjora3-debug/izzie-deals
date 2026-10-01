import fs from 'fs';
import path from 'path';

console.log('🔧 Completely rewriting ProductCard with safe image handling...\n');

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
    price?: number;
    basePrice?: number;
    base_price?: number;
    image?: string;
    images?: string[];
    image_url?: string;
    category?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Safely extract price
  const safePrice = product.price ?? product.basePrice ?? product.base_price ?? 0;
  
  // Safely extract image
  const safeImage = product.image || (product.images && product.images[0]) || product.image_url || '';

  // Generate a consistent pastel color based on product name
  const getPlaceholderColor = (name: string) => {
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-yellow-100', 'bg-indigo-100'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
        <Link href={\`/product/\${product.id}\`} className="block w-full h-full">
          {safeImage ? (
            <Image
              src={safeImage}
              alt={product.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
          ) : (
            <div className={\`w-full h-full flex flex-col items-center justify-center \${getPlaceholderColor(product.name)}\`}>
              <svg className="w-16 h-16 text-gray-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-500 mt-2 text-center px-2">No Image</span>
            </div>
          )}
        </Link>
        
        {/* Wishlist Button */}
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
            {formatCurrency(safePrice, 'KES')}
          </p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(productCardPath, cardCode, 'utf8');
console.log('✅ Successfully rewrote ProductCard.tsx with safe image and price handling.');
console.log('🎉 Missing images will now show beautiful, consistent colored placeholders!');