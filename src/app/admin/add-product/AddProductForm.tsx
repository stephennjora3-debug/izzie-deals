'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/actions/product.actions';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AddProductForm({ categories, brands }: { categories: any[]; brands: any[] }) {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 60);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slugField = formRef.current?.elements.namedItem('slug') as HTMLInputElement;
    if (slugField && !slugField.value) {
      slugField.value = generateSlug(name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    if (imageUrls.length === 0) {
      setError('Please upload at least one product image.');
      setIsSubmitting(false);
      return;
    }

    try {
      await createProduct({
        name: formData.get('name') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        base_price: Number(formData.get('base_price')),
        category_id: formData.get('category_id') as string,
        brand_id: formData.get('brand_id') as string,
        image_urls: imageUrls,
      });
      
      alert('Product added successfully!');
      router.push('/shop');
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-brand-200">
      <div>
        <label className="block text-sm font-medium text-brand-700 mb-1">Product Name</label>
        <Input name="name" required placeholder="e.g. Premium Leather Wallet" onChange={handleNameChange} />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-700 mb-1">Slug (URL friendly)</label>
        <Input name="slug" required placeholder="e.g. premium-leather-wallet" className="bg-brand-50" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Price (KES)</label>
          <Input name="base_price" type="number" required placeholder="2500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Category</label>
          <select name="category_id" required className="w-full border border-brand-300 rounded-md px-3 py-2">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-700 mb-1">Brand</label>
        <select name="brand_id" required className="w-full border border-brand-300 rounded-md px-3 py-2">
          <option value="">Select Brand</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-700 mb-1">Description</label>
        <textarea name="description" rows={4} className="w-full border border-brand-300 rounded-md px-3 py-2" placeholder="Product details..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-700 mb-2">Product Image</label>
        <ImageUpload value={imageUrls} onChange={setImageUrls} />
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Adding Product...' : 'Add Product to Shop'}
      </Button>
    </form>
  );
}
