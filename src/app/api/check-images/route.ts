import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  // Try to fetch from product_images table
  const { data: images, error: imagesError } = await supabase
    .from('product_images')
    .select('*')
    .limit(5);
  
  // Also check the products table for any image-related columns
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, image, image_url, images')
    .limit(3);
  
  return Response.json({
    productImages: images,
    productImagesError: imagesError?.message || null,
    products: products,
    productsError: productsError?.message || null
  });
}
