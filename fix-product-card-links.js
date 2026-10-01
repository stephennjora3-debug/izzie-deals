import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/product/ProductCard.tsx');

console.log('Reading file: ' + filePath + '\n');

let content = fs.readFileSync(filePath, 'utf8');

// ANCHOR 1: Add slug to the interface
const OLD_INTERFACE = `  product: {
    id: string;
    name: string;
    price?: number;
    basePrice?: number;
    base_price?: number;
    image?: string;
    images?: string[];
    image_url?: string;
    category?: string;
  };`;

const NEW_INTERFACE = `  product: {
    id: string;
    name: string;
    slug?: string;
    price?: number;
    basePrice?: number;
    base_price?: number;
    image?: string;
    images?: string[];
    image_url?: string;
    category?: string;
  };`;

if (!content.includes(OLD_INTERFACE)) {
  console.log("ANCHOR 1 NOT FOUND (Interface)");
  process.exit(1);
}
content = content.split(OLD_INTERFACE).join(NEW_INTERFACE);

// ANCHOR 2: Update Link href in image container to use slug (fallback to id)
const OLD_LINK_1 = `<Link href={\`/product/\${product.id}\`} className="block w-full h-full">`;
const NEW_LINK_1 = `<Link href={\`/product/\${product.slug || product.id}\`} className="block w-full h-full">`;

if (!content.includes(OLD_LINK_1)) {
  console.log("ANCHOR 2 NOT FOUND (Image Link)");
  process.exit(1);
}
content = content.split(OLD_LINK_1).join(NEW_LINK_1);

// ANCHOR 3: Update Link href in title to use slug (fallback to id)
const OLD_LINK_2 = `<Link href={\`/product/\${product.id}\`} className="flex-grow">`;
const NEW_LINK_2 = `<Link href={\`/product/\${product.slug || product.id}\`} className="flex-grow">`;

if (!content.includes(OLD_LINK_2)) {
  console.log("ANCHOR 3 NOT FOUND (Title Link)");
  process.exit(1);
}
content = content.split(OLD_LINK_2).join(NEW_LINK_2);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ SUCCESS: Updated ProductCard.tsx');
console.log('   Added "slug" to interface.');
console.log('   Changed links from /product/${product.id} to /product/${product.slug || product.id}');