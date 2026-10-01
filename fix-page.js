import fs from 'fs';
import path from 'path';

const filePath = path.join('src', 'app', '(shop)', 'product', '[slug]', 'page.tsx');

const newPageContent = `import { getProductBySlug } from '@/services/product.service';
import { ProductDetailsClient } from '@/components/product/ProductDetailsClient';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
`;

fs.writeFileSync(filePath, newPageContent, 'utf8');
console.log('src/app/(shop)/product/[slug]/page.tsx updated to fetch real product data.');