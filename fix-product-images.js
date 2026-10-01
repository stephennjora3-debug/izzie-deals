import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing empty image URLs and restoring real product data...\n');

// 1. Fix ProductCard to handle empty images
const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');

if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  // Replace the Image component with a conditional render
  const oldImageBlock = `        <Link href={\`/product/\${product.id}\`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        </Link>`;

  const newImageBlock = `        <Link href={\`/product/\${product.id}\`} className="block w-full h-full">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </Link>`;

  if (code.includes(oldImageBlock)) {
    code = code.replace(oldImageBlock, newImageBlock);
    console.log('✅ Fixed ProductCard to handle empty images.');
  } else {
    // Fallback: just add a check
    code = code.replace(
      /src=\{product\.image\}/,
      'src={product.image || "/placeholder.png"}'
    );
    console.log('✅ Applied fallback fix for empty images.');
  }

  fs.writeFileSync(productCardPath, code, 'utf8');
}

// 2. Restore the original Shop page that fetches real products
const shopPath = path.join('src', 'app', '(shop)', 'page.tsx');

if (fs.existsSync(shopPath)) {
  const shopCode = `import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';

async function ShopContent() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return <div className="text-center py-12">Error loading products.</div>;
  }

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
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-brand-900">{products?.length || 0}</span> results
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product: any) => (
                <ProductCard 
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.base_price,
                    image: product.images?.[0] || product.image_url || '',
                    category: product.category || 'General'
                  }}
                />
              ))}
            </div>

            {(!products || products.length === 0) && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">No products available yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading products...</div>}>
      <ShopContent />
    </Suspense>
  );
}
`;

  fs.writeFileSync(shopPath, shopCode, 'utf8');
  console.log('✅ Restored Shop page with real product fetching.');
} else {
  console.log('⚠️ Shop page not found at (shop)/page.tsx. Trying alternative path...');
  
  const altShopPath = path.join('src', 'app', 'shop', 'page.tsx');
  if (fs.existsSync(altShopPath)) {
    // Same content but for different path
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
    return <div className="text-center py-12">Error loading products.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Shop All Products</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">Discover our curated collection of premium goods.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-gray-600">Showing <span className="font-semibold text-brand-900">{products?.length || 0}</span> results</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product: any) => (
            <ProductCard 
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.base_price,
                image: product.images?.[0] || product.image_url || '',
                category: product.category || 'General'
              }}
            />
          ))}
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
    fs.writeFileSync(altShopPath, shopCode, 'utf8');
    console.log('✅ Restored Shop page at alternative path.');
  }
}

console.log('\n🎉 Product images and shop page fixed!');