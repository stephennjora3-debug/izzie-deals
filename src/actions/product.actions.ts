'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: {
  name: string;
  slug: string;
  description: string;
  base_price: number;
  category_id: string;
  brand_id: string;
  image_urls: string[];
}) {
  const supabase = createAdminClient();

  // 1. Insert Product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      base_price: formData.base_price,
      category_id: formData.category_id,
      brand_id: formData.brand_id,
      status: 'active',
    })
    .select()
    .single();

  if (productError || !product) {
    console.error('Product creation error:', productError);
    throw new Error('Failed to create product');
  }

  // 2. Insert Product Images
  if (formData.image_urls && formData.image_urls.length > 0) {
    const imagesToInsert = formData.image_urls.map((url, index) => ({
      product_id: product.id,
      cloudinary_public_id: (url.split('/').pop() || 'image').split('.')[0],
      image_url: url,
      is_primary: index === 0,
      display_order: index,
    }));

    const { error: imageError } = await supabase
      .from('product_images')
      .insert(imagesToInsert);

    if (imageError) console.error('Image creation error:', imageError);
  }

  revalidatePath('/shop');
  return { success: true, productId: product.id };
}
