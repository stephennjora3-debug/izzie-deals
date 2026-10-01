import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixSlugs() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase.from('products').select('id, name, slug');
  
  if (error) { console.error(error); return; }

  for (const p of products) {
    // Create a clean slug: lowercase, replace spaces/special chars with hyphens
    const cleanSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    if (p.slug !== cleanSlug) {
      console.log(`Fixing "${p.name}" -> "${cleanSlug}"`);
      await supabase.from('products').update({ slug: cleanSlug }).eq('id', p.id);
    }
  }
  console.log('Done! All slugs are now clean.');
}

fixSlugs();