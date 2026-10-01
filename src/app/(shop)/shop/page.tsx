import { ProductCard } from '@/components/product/ProductCard';
import { getActiveProducts } from '@/services/product.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SlidersHorizontal } from 'lucide-react';
import { SortDropdown } from '@/components/shop/SortDropdown';
import Link from 'next/link';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const products = await getActiveProducts(resolvedParams.search);
  
  const category = resolvedParams.category || 'All';
  const sort = resolvedParams.sort || 'featured';

  // Filter by category
  const filteredProducts = category === 'All' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === category.toLowerCase());

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.basePrice - b.basePrice;
    if (sort === 'price-desc') return b.basePrice - a.basePrice;
    if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0; // featured
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-900 mb-2">Shop All Products</h1>
        <p className="text-brand-600">Discover our curated collection of premium goods.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Show Filters
              </Button>
            </div>

            <div className="hidden lg:block space-y-8">
              <div>
                <h3 className="font-semibold text-brand-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {['All', 'Clothing', 'Electronics', 'Accessories', 'Shoes', 'Home'].map((cat) => (
                    <Link 
                      key={cat} 
                      href={`/shop?category=${encodeURIComponent(cat)}&sort=${sort}`}
                      className={`block text-sm transition-colors ${category === cat ? 'text-brand-900 font-semibold' : 'text-brand-700 hover:text-brand-900'}`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-brand-900 mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" className="h-9" />
                  <span className="text-brand-400">-</span>
                  <Input type="number" placeholder="Max" className="h-9" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {/* Toolbar */}
          <form className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-brand-200">
            <p className="text-sm text-brand-600">
              Showing <span className="font-semibold text-brand-900">{sortedProducts.length}</span> results
            </p>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-brand-600">Sort by:</span>
              <SortDropdown />
            </div>
          </form>

          {/* Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-brand-50 rounded-lg">
              <p className="text-brand-600 mb-4">No products found matching your criteria.</p>
              <Link href="/shop">
                <Button variant="outline">Clear Filters</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
