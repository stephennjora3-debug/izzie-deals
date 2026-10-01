import fs from 'fs';
import path from 'path';

const shopPagePath = path.join('src', 'app', '(shop)', 'shop', 'page.tsx');

if (!fs.existsSync(shopPagePath)) {
  console.log('File not found:', shopPagePath);
  process.exit(1);
}

let c = fs.readFileSync(shopPagePath, 'utf8');

// 1. Update the searchParams type to include 'search'
c = c.replace(
  'searchParams: Promise<{ category?: string; sort?: string }>',
  'searchParams: Promise<{ category?: string; sort?: string; search?: string }>'
);

// 2. Fix the order: resolvedParams MUST come before getActiveProducts
// Find the block where they are out of order
const badOrder = `  const products = await getActiveProducts(resolvedParams.search);
  const resolvedParams = await searchParams;`;

const goodOrder = `  const resolvedParams = await searchParams;
  const products = await getActiveProducts(resolvedParams.search);`;

if (c.includes(badOrder)) {
  c = c.replace(badOrder, goodOrder);
  console.log('1. Fixed variable initialization order.');
} else {
  console.log('Warning: Could not find the exact bad order block. Checking for alternatives...');
  // Fallback: just make sure resolvedParams is defined first
  if (c.includes('const resolvedParams = await searchParams;')) {
     // It might already be in the right order but the error persists, or it's slightly different.
     // Let's do a regex replacement to be safe.
     c = c.replace(/const products = await getActiveProducts\((.*?)\);([\s\S]*?)const resolvedParams = await searchParams;/, 
                   'const resolvedParams = await searchParams;$2  const products = await getActiveProducts($1);');
     console.log('1. Applied regex fix for variable order.');
  }
}

fs.writeFileSync(shopPagePath, c, 'utf8');
console.log('\nShop page order fixed!');