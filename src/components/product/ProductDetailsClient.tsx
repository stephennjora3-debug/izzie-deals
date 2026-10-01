'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Minus, Plus, ShoppingCart, Heart, Truck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');
  const addItem = useCartStore((state) => state.addItem);

  const displayPrice = product.salePrice || product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  
  // Find stock for current selection
  const currentVariant = product.variants.find(
    v => v.attributes?.Size === selectedSize && v.attributes?.Color === selectedColor
  );
  const isOutOfStock = currentVariant ? currentVariant.stockQuantity === 0 : false;

  const availableSizes = [...new Set(product.variants.map(v => v.attributes?.Size).filter(Boolean))];
  const availableColors = [...new Set(product.variants.map(v => v.attributes?.Color).filter(Boolean))];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-brand-600 mb-8">
        <Link href="/" className="hover:text-brand-900">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-brand-900">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-brand-900">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-brand-100 rounded-xl overflow-hidden relative">
            <Image
              src={product.images[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                SALE
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-brand-900' : 'border-transparent hover:border-brand-300'
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} width={100} height={100} className="w-full h-full object-contain bg-white" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-brand-600 mb-1">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-900 mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-brand-300'}`} />
                ))}
              </div>
              <span className="text-sm text-brand-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-900">
                {formatCurrency(displayPrice, product.currency)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-brand-500 line-through">
                  {formatCurrency(product.basePrice, product.currency)}
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-b border-brand-200 py-6 space-y-6">
            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-brand-900 mb-3">
                  Color: <span className="font-normal text-brand-600">{selectedColor}</span>
                </p>
                <div className="flex gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                        selectedColor === color 
                          ? 'border-brand-900 bg-brand-900 text-white' 
                          : 'border-brand-300 text-brand-700 hover:border-brand-900'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-brand-900">
                    Size: <span className="font-normal text-brand-600">{selectedSize}</span>
                  </p>
                  <button className="text-sm text-brand-600 underline hover:text-brand-900">Size Guide</button>
                </div>
                <div className="flex gap-3">
                  {availableSizes.map((size) => {
                    const variant = product.variants.find(v => v.attributes?.Size === size && v.attributes?.Color === selectedColor);
                    const disabled = variant ? variant.stockQuantity === 0 : false;
                    
                    return (
                      <button
                        key={size}
                        disabled={disabled}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-md border text-sm font-medium transition-all ${
                          selectedSize === size 
                            ? 'border-brand-900 bg-brand-900 text-white' 
                            : disabled 
                              ? 'border-brand-200 text-brand-300 cursor-not-allowed line-through'
                              : 'border-brand-300 text-brand-700 hover:border-brand-900'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {isOutOfStock && (
                  <p className="text-sm text-red-600 mt-2">This variant is currently out of stock.</p>
                )}
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-brand-300 rounded-md w-max">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-brand-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-brand-50 transition-colors"
                  disabled={isOutOfStock || (currentVariant && quantity >= currentVariant.stockQuantity)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button 
                size="lg" 
                className="flex-1" 
                disabled={isOutOfStock}
                onClick={() => {
                  if (!isOutOfStock) {
                    addItem({
                      productId: product.id,
                      variantId: currentVariant?.id,
                      name: product.name,
                      price: displayPrice,
                      quantity: quantity,
                      image: product.images[0],
                      attributes: { 
                        ...(selectedSize && { Size: selectedSize }), 
                        ...(selectedColor && { Color: selectedColor }) 
                      }
                    });
                  }
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button variant="outline" size="lg" className="flex-1">
                Buy Now
              </Button>

              <Button variant="ghost" size="icon" className="border border-brand-300">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 text-sm text-brand-700">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-brand-900" />
              <span>Free delivery in Nairobi</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-brand-900" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="border-t border-brand-200 pt-12">
        <div className="flex border-b border-brand-200 mb-8">
          {(['description', 'reviews', 'shipping'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab 
                  ? 'border-brand-900 text-brand-900' 
                  : 'border-transparent text-brand-600 hover:text-brand-900'
              }`}
            >
              {tab} {tab === 'reviews' && `(${product.reviewCount})`}
            </button>
          ))}
        </div>

        <div className="max-w-3xl">
          {activeTab === 'description' && (
            <div className="prose prose-brand max-w-none">
              <p className="text-brand-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-12 bg-brand-50 rounded-lg">
              <p className="text-brand-600 mb-4">Customer reviews will be displayed here.</p>
              <Button variant="outline">Write a Review</Button>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 text-brand-700">
              <p><strong>Standard Delivery:</strong> 2-4 business days (KES 200)</p>
              <p><strong>Express Delivery:</strong> Next day delivery in Nairobi (KES 500)</p>
              <p><strong>Upcountry:</strong> 3-5 business days via G4S or Wells Fargo (KES 400)</p>
              <p className="mt-4 text-sm text-brand-600">
                Orders placed before 2 PM EAT are processed the same day. You will receive an SMS with tracking details once your order ships.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
