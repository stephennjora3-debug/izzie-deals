import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/product/ProductDetailsClient.tsx');

console.log('Reading file: ' + filePath + '\n');

let content = fs.readFileSync(filePath, 'utf8');

// ANCHOR 1: Remove the debug log we added
const OLD_DEBUG = `export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  console.log('PRODUCT DETAILS DEBUG:', JSON.stringify({
    name: product.name,
    images: product.images,
    imagesLength: product.images.length,
    basePrice: product.basePrice,
    slug: product.slug
  }, null, 2));
  const [selectedImage, setSelectedImage] = useState(0);`;

const NEW_DEBUG = `export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);`;

if (!content.includes(OLD_DEBUG)) {
  console.log("ANCHOR 1 NOT FOUND (Debug log removal)");
  process.exit(1);
}
content = content.split(OLD_DEBUG).join(NEW_DEBUG);

// ANCHOR 2: Add the missing 'sizes' prop to fix the Next.js warning
const OLD_IMAGE = `            <Image
              src={product.images[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />`;

const NEW_IMAGE = `            <Image
              src={product.images[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
            />`;

if (!content.includes(OLD_IMAGE)) {
  console.log("ANCHOR 2 NOT FOUND (Main Image sizes prop)");
  process.exit(1);
}
content = content.split(OLD_IMAGE).join(NEW_IMAGE);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ SUCCESS: Cleaned up ProductDetailsClient.tsx');
console.log('   1. Removed debug console.log');
console.log('   2. Added "sizes" prop to fix Next.js Image warning');
console.log('\n🎉 The product images are successfully loading and the code is now clean!');