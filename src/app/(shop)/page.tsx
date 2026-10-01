import { Suspense } from 'react';
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
                href={category === 'All Products' ? '/shop' : `/shop?category=${encodeURIComponent(category)}`}
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
