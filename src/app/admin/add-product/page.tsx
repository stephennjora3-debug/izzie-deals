import { createAdminClient } from '@/lib/supabase/admin';
import AddProductForm from './AddProductForm';

export default async function AddProductPage() {
  try {
    const supabase = createAdminClient();

    const { data: categories, error: catError } = await supabase.from('categories').select('id, name').eq('is_active', true);
    const { data: brands, error: brandError } = await supabase.from('brands').select('id, name');

    if (catError) console.warn('Category fetch warning:', catError.message);
    if (brandError) console.warn('Brand fetch warning:', brandError.message);

    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-900 mb-8">Add New Product</h1>
        <AddProductForm categories={categories || []} brands={brands || []} />
      </div>
    );
  } catch (err: any) {
    return <div className="p-8 text-red-600 bg-red-50 rounded">Critical Error: {err.message}</div>;
  }
}
