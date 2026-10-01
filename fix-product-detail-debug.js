import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/product/ProductDetailsClient.tsx');

console.log('Reading file: ' + filePath + '\n');

let content = fs.readFileSync(filePath, 'utf8');

// EXACT ANCHOR: Add debug logging at the start of the component
const OLD = `export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);`;

const NEW = `export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  console.log('PRODUCT DETAILS DEBUG:', JSON.stringify({
    name: product.name,
    images: product.images,
    imagesLength: product.images.length,
    basePrice: product.basePrice,
    slug: product.slug
  }, null, 2));
  const [selectedImage, setSelectedImage] = useState(0);`;

if (!content.includes(OLD)) {
  console.log("ANCHOR NOT FOUND. The file content might have changed.");
  console.log("Looking for exactly:");
  console.log(OLD);
  process.exit(1);
}

// Safe replacement
content = content.split(OLD).join(NEW);
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ SUCCESS: Added debug logging to ProductDetailsClient.tsx');
console.log('   This will show exactly what images are being passed to the component.');
console.log('\nNext steps:');
console.log('1. Refresh the product detail page');
console.log('2. Open the browser console (F12)');
console.log('3. Look for "PRODUCT DETAILS DEBUG" message');
console.log('4. Copy the output and paste it here');