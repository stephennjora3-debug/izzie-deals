import fs from 'fs';
import path from 'path';

console.log('🔧 Making ProductCard smart enough to find base_price and images...\n');

const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');

if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  // 1. Update the interface to be more flexible
  const oldInterface = `interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
  };
}`;

  const newInterface = `interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price?: number;
    basePrice?: number;
    base_price?: number;
    image?: string;
    images?: string[];
    image_url?: string;
    category?: string;
  };
}`;

  if (code.includes(oldInterface)) {
    code = code.replace(oldInterface, newInterface);
  }

  // 2. Add safe fallbacks for price and image inside the component
  // Find the line where we define imageUrl or use product.image
  if (!code.includes('const safePrice')) {
    // Insert safe variables right after the component declaration
    code = code.replace(
      /export function ProductCard\(\{ product \}: ProductCardProps\) \{/,
      `export function ProductCard({ product }: ProductCardProps) {
  // Safely extract price, checking all possible database column names
  const safePrice = product.price ?? product.basePrice ?? product.base_price ?? 0;
  
  // Safely extract image
  const safeImage = product.image || (product.images && product.images[0]) || product.image_url || '';`
    );
  }

  // 3. Update the Image src to use safeImage
  code = code.replace(/src=\{product\.image\}/g, 'src={safeImage}');
  code = code.replace(/src=\{imageUrl\}/g, 'src={safeImage}');

  // 4. Update the formatCurrency call to use safePrice
  code = code.replace(/formatCurrency\(product\.price/g, 'formatCurrency(safePrice');
  code = code.replace(/formatCurrency\(product\.basePrice/g, 'formatCurrency(safePrice');

  fs.writeFileSync(productCardPath, code, 'utf8');
  console.log('✅ Updated ProductCard to safely handle base_price and missing images.');
} else {
  console.log('❌ ProductCard.tsx not found.');
}

console.log('\n🎉 ProductCard mapping fixed!');