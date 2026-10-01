import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixImages() {
  console.log('Fetching wireless-headphones product...');
  
  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('slug', 'wireless-headphones')
    .single();

  if (!product) {
    console.error('Product not found!');
    return;
  }

  console.log('Inserting image for headphones...');
  
  const { error } = await supabase
    .from('product_images')
    .insert([
      { 
        product_id: product.id, 
        cloudinary_public_id: 'demo/headphones1', 
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 
        is_primary: true, 
        display_order: 1 
      }
    ]);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Headphone image added.');
  }
}

fixImages();