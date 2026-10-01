import fs from 'fs';
import path from 'path';

const servicePath = path.join('src', 'services', 'product.service.ts');

if (!fs.existsSync(servicePath)) {
  console.log('File not found:', servicePath);
  process.exit(1);
}

let c = fs.readFileSync(servicePath, 'utf8');

// Find the old broken query block and replace it with the correct conditional pattern
const oldQueryBlock = `  // Fetch products with their category and brand names, plus images and variants
  const { data, error } = await supabase
    .from('products')
    .select(\`
      id,
      name,
      slug,
      description,
      base_price,
      currency,
      status,
      created_at,
      updated_at,
      categories (
        name,
        slug
      ),
      brands (
        name,
        slug
      ),
      product_images (
        image_url,
        is_primary,
        display_order
      ),
      product_variants (
        id,
        sku,
        price_override,
        stock_quantity,
        attributes,
        is_active
      )
    \`)
    .eq('status', 'active')
    .modify((query) => {
      if (searchQuery) {
        query.ilike('name', \`%\${searchQuery}%\`);
      }
    })
    .order('created_at', { ascending: false });`;

const newQueryBlock = `  // Fetch products with their category and brand names, plus images and variants
  let query = supabase
    .from('products')
    .select(\`
      id,
      name,
      slug,
      description,
      base_price,
      currency,
      status,
      created_at,
      updated_at,
      categories (
        name,
        slug
      ),
      brands (
        name,
        slug
      ),
      product_images (
        image_url,
        is_primary,
        display_order
      ),
      product_variants (
        id,
        sku,
        price_override,
        stock_quantity,
        attributes,
        is_active
      )
    \`)
    .eq('status', 'active');

  if (searchQuery) {
    query = query.ilike('name', \`%\${searchQuery}%\`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });`;

if (c.includes(oldQueryBlock)) {
  c = c.replace(oldQueryBlock, newQueryBlock);
  fs.writeFileSync(servicePath, c, 'utf8');
  console.log('1. Fixed Supabase conditional query in getActiveProducts.');
} else {
  console.log('Warning: Could not find the exact query block. Please check src/services/product.service.ts manually.');
  console.log('Look for .modify((query) => { and replace it with conditional query building.');
}