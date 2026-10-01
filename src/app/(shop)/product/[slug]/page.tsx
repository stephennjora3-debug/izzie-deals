import { getProductBySlug } from '@/services/product.service';
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
