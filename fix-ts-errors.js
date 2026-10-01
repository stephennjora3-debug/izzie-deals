import fs from 'fs';
import path from 'path';

console.log('Fixing TypeScript build errors...');

// 1. Fix product.actions.ts
const actionPath = path.join('src', 'actions', 'product.actions.ts');
if (fs.existsSync(actionPath)) {
  let c = fs.readFileSync(actionPath, 'utf8');
  
  // Fix: url.split('/').pop() might be undefined
  c = c.replace(
    "cloudinary_public_id: url.split('/').pop().split('.')[0],",
    "cloudinary_public_id: (url.split('/').pop() || 'image').split('.')[0],"
  );
  
  fs.writeFileSync(actionPath, c, 'utf8');
  console.log('1. Fixed product.actions.ts');
}

// 2. Fix product.service.ts
const servicePath = path.join('src', 'services', 'product.service.ts');
if (fs.existsSync(servicePath)) {
  let c = fs.readFileSync(servicePath, 'utf8');
  
  // Fix: data.categories and data.brands are arrays, not objects
  c = c.replace(
    "category: data.categories?.name || 'Uncategorized',",
    "category: data.categories?.[0]?.name || 'Uncategorized',"
  );
  
  c = c.replace(
    "brand: data.brands?.name || 'Unknown',",
    "brand: data.brands?.[0]?.name || 'Unknown',"
  );
  
  fs.writeFileSync(servicePath, c, 'utf8');
  console.log('2. Fixed product.service.ts');
}

console.log('\n✅ TypeScript errors fixed!');