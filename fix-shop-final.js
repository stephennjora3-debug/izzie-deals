import fs from 'fs';
import path from 'path';

console.log('🔧 Applying final fix based on actual database structure...\n');

const shopCode = `import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product/ProductCard';
import { formatCurrency } from '@/lib/utils';

async function ShopContent() {
  const supabase = await createClient();

  // Fetch products
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
      {/* Header */}
      <div className="border-b border-gray-100 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop All Products</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Discover our curated collection of premium goods.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">{products?.length || 0}</span> results</p>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products?.map((product: any) => (
            <div key={product.id} className="group flex flex-col h-full">
              {/* Image Placeholder (Since no image column exists in main table) */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 mb-3 flex items-center justify-center">
                 <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
              </div>

              {/* Product Details */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-brand-900 transition-colors">
                  {product.name}
                </h3>
                <div className="mt-auto">
                  {/* Use base_price explicitly */}
                  <p className="text-base font-bold text-gray-900">
                    {formatCurrency(product.base_price, 'KES')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
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

// Update both possible paths
const paths = [
  path.join('src', 'app', '(shop)', 'page.tsx'),
  path.join('src', 'app', 'shop', 'page.tsx')
];

let updated = false;
for (const p of paths) {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, shopCode, 'utf8');
    console.log('✅ Updated Shop page at:', p);
    updated = true;
  }
}

if (!updated) {
  console.log('⚠️ Could not find shop page. Please check src/app/(shop)/page.tsx');
}

console.log('\n🎉 Shop mapping fixed!');