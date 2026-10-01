import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Use service role key to bypass RLS for seeding
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('Starting database seed...');

  // 1. Insert Categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .upsert([
      { name: 'Clothing', slug: 'clothing', display_order: 1 },
      { name: 'Electronics', slug: 'electronics', display_order: 2 },
      { name: 'Accessories', slug: 'accessories', display_order: 3 },
      { name: 'Shoes', slug: 'shoes', display_order: 4 },
      { name: 'Home', slug: 'home', display_order: 5 },
    ])
    .select();

  if (catError) {
    console.error('Error seeding categories:', catError);
    return;
  }
  console.log(`Inserted ${categories.length} categories.`);

  // 2. Insert Brands
  const { data: brands, error: brandError } = await supabase
    .from('brands')
    .upsert([
      { name: 'Aura Basics', slug: 'aura-basics' },
      { name: 'SoundTech', slug: 'soundtech' },
      { name: 'Craft & Co', slug: 'craft-and-co' },
      { name: 'Stride', slug: 'stride' },
    ])
    .select();

  if (brandError) {
    console.error('Error seeding brands:', brandError);
    return;
  }
  console.log(`Inserted ${brands.length} brands.`);

  // Find IDs for relationships
  const clothingCat = categories.find(c => c.slug === 'clothing');
  const electronicsCat = categories.find(c => c.slug === 'electronics');
  const auraBrand = brands.find(b => b.slug === 'aura-basics');
  const soundBrand = brands.find(b => b.slug === 'soundtech');

  // 3. Insert Products
  const { data: products, error: prodError } = await supabase
    .from('products')
    .upsert([
      {
        name: 'Premium Cotton T-Shirt',
        slug: 'premium-cotton-tshirt',
        description: 'Crafted from 100% organic combed cotton, this premium t-shirt offers exceptional softness and durability.',
        base_price: 2500,
        category_id: clothingCat?.id,
        brand_id: auraBrand?.id,
        status: 'active'
      },
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
        base_price: 15000,
        category_id: electronicsCat?.id,
        brand_id: soundBrand?.id,
        status: 'active'
      }
    ])
    .select();

  if (prodError) {
    console.error('Error seeding products:', prodError);
    return;
  }
  console.log(`Inserted ${products.length} products.`);

  // 4. Insert Variants for T-Shirt
  const tshirt = products.find(p => p.slug === 'premium-cotton-tshirt');
  if (tshirt) {
    const { error: varError } = await supabase
      .from('product_variants')
      .upsert([
        { product_id: tshirt.id, sku: 'TSHIRT-BLK-S', stock_quantity: 15, attributes: { Size: 'S', Color: 'Black' } },
        { product_id: tshirt.id, sku: 'TSHIRT-BLK-M', stock_quantity: 24, attributes: { Size: 'M', Color: 'Black' } },
        { product_id: tshirt.id, sku: 'TSHIRT-BLK-L', stock_quantity: 8, attributes: { Size: 'L', Color: 'Black' } },
        { product_id: tshirt.id, sku: 'TSHIRT-WHT-M', stock_quantity: 12, attributes: { Size: 'M', Color: 'White' } },
      ]);
    if (varError) console.error('Error seeding tshirt variants:', varError);
    else console.log('Inserted T-Shirt variants.');
  }

  // 5. Insert Images
  if (tshirt) {
    const { error: imgError } = await supabase
      .from('product_images')
      .upsert([
        { product_id: tshirt.id, cloudinary_public_id: 'demo/tshirt1', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', is_primary: true, display_order: 1 },
        { product_id: tshirt.id, cloudinary_public_id: 'demo/tshirt2', image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', is_primary: false, display_order: 2 },
      ]);
    if (imgError) console.error('Error seeding tshirt images:', imgError);
    else console.log('Inserted T-Shirt images.');
  }

  console.log('\nDatabase seed completed successfully!');
}

seedDatabase();