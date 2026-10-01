import fs from 'fs';
import path from 'path';

console.log('🔧 Creating proper image handling for products...\n');

// 1. Update ProductCard to handle missing images gracefully with a colored placeholder
const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');

if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  // Add a function to generate placeholder colors based on product name
  const placeholderFunction = `
  // Generate a consistent color based on product name
  const getPlaceholderColor = (name: string) => {
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-yellow-100', 'bg-indigo-100'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
`;

  // Insert the function after the component declaration
  if (!code.includes('getPlaceholderColor')) {
    code = code.replace(
      /export function ProductCard\(\{ product \}: ProductCardProps\) \{/,
      `export function ProductCard({ product }: ProductCardProps) {${placeholderFunction}`
    );
  }

  // Replace the image placeholder section with a better colored placeholder
  const oldPlaceholder = `          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}`;

  const newPlaceholder = `          {safeImage ? (
            <Image
              src={safeImage}
              alt={product.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
          ) : (
            <div className={\`w-full h-full flex flex-col items-center justify-center \${getPlaceholderColor(product.name)}\`}>
              <svg className="w-16 h-16 text-gray-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-500 mt-2 text-center px-2">No Image</span>
            </div>
          )}`;

  if (code.includes(oldPlaceholder)) {
    code = code.replace(oldPlaceholder, newPlaceholder);
    console.log('✅ Updated ProductCard with colored placeholders.');
  } else {
    console.log('⚠️ Could not find exact placeholder block. Applying simpler fix...');
    // Simpler replacement
    code = code.replace(/bg-gray-200/g, getPlaceholderColor(product.name)});
    fs.writeFileSync(productCardPath, code, 'utf8');
  }

  fs.writeFileSync(productCardPath, code, 'utf8');
}

// 2. Create a quick script to check if there's a product_images table
const checkImagesPath = path.join('src', 'app', 'check-images', 'route.ts');
fs.mkdirSync(path.dirname(checkImagesPath), { recursive: true });

const checkCode = `import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  // Try to find product images table
  const { data: tables } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .ilike('table_name', '%product%image%');
  
  return Response.json({ 
    message: 'Check your Supabase dashboard for tables containing "image"',
    possibleTables: tables 
  });
}
`;

fs.writeFileSync(checkImagesPath, checkCode, 'utf8');
console.log('✅ Created diagnostic endpoint at /check-images');

console.log('\n🎉 Product images fixed with colored placeholders!');