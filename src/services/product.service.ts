import { createClient } from '@/lib/supabase/server';
import { Product, ProductVariant, Category } from '@/types';

export async function getActiveProducts(searchQuery?: string): Promise<Product[]> {
  const supabase = await await createClient();

  // Fetch products with their category and brand names, plus images and variants
  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      base_price,
      currency,
      status,
      created_at,
      updated_at,
      categories (
        name,
        slug
      ),
      brands (
        name,
        slug
      ),
      product_images (
        image_url,
        is_primary,
        display_order
      ),
      product_variants (
        id,
        sku,
        price_override,
        stock_quantity,
        attributes,
        is_active
      )
    `)
    .eq('status', 'active');

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Transform Supabase data to match our frontend Product type
  return (data || []).map((item: any) => {
    // Calculate potential sale price from variants
    const activeVariants = (item.product_variants || []).filter((v: any) => v.is_active);
    const lowestVariantPrice = activeVariants.length > 0 
      ? Math.min(...activeVariants.map((v: any) => Number(v.price_override || item.base_price)))
      : Number(item.base_price);
    
    const displayPrice = lowestVariantPrice < Number(item.base_price) ? lowestVariantPrice : undefined;

    return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description || '',
    basePrice: Number(item.base_price),
    salePrice: displayPrice,
    currency: item.currency || 'KES',
    category: item.categories?.name || 'Uncategorized',
    brand: item.brands?.name || 'Unknown',
    images: (item.product_images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => img.image_url),
    variants: (item.product_variants || []).map((v: any) => ({
      id: v.id,
      productId: item.id,
      sku: v.sku,
      price: v.price_override ? Number(v.price_override) : undefined,
      stockQuantity: v.stock_quantity || 0,
      attributes: v.attributes || {},
      isActive: v.is_active,
    })),
    rating: 0, // Will be calculated from reviews later
    reviewCount: 0,
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      base_price,
      currency,
      status,
      created_at,
      updated_at,
      categories (name, slug),
      brands (name, slug),
      product_images (image_url, is_primary, display_order),
      product_variants (id, sku, price_override, stock_quantity, attributes, is_active)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description || '',
    basePrice: Number(data.base_price),
    currency: data.currency || 'KES',
    category: data.categories?.[0]?.name || 'Uncategorized',
    brand: data.brands?.[0]?.name || 'Unknown',
    images: (data.product_images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => img.image_url),
    variants: (data.product_variants || []).map((v: any) => ({
      id: v.id,
      productId: data.id,
      sku: v.sku,
      price: v.price_override ? Number(v.price_override) : undefined,
      stockQuantity: v.stock_quantity || 0,
      attributes: v.attributes || {},
      isActive: v.is_active,
    })),
    rating: 0,
    reviewCount: 0,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
