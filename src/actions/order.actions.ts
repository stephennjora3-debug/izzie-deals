'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// 1. STRICT INPUT VALIDATION (Manifesto Point 10)
const shippingSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  addressLine1: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
});

const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(99),
});

export type ShippingDetails = z.infer<typeof shippingSchema>;
export type CartItemForOrder = z.infer<typeof cartItemSchema>;

export async function createOrder(items: CartItemForOrder[], shipping: ShippingDetails) {
  // Validate inputs strictly
  const validatedShipping = shippingSchema.parse(shipping);
  const validatedItems = z.array(cartItemSchema).parse(items);

  if (validatedItems.length === 0) {
    throw new Error('Cart is empty');
  }

  // 2. SECURE SERVER CLIENT (Manifesto Point 1, 8)
  // Using Admin Client because this is a protected Server Action with strict Zod validation.
  // This bypasses RLS issues for guest checkout while remaining secure.
  const supabase = createAdminClient();
  const userId = null; // Guest checkout for now

  // 3. FETCH CURRENT PRICES AND STOCK (Manifesto Point 8)
  const allProductIds = [...new Set(validatedItems.map(i => i.productId))];
  const allVariantIds = validatedItems.filter(i => i.variantId).map(i => i.variantId);

  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('id, base_price, name, status')
    .in('id', allProductIds);

  if (productsError || !productsData || productsData.length !== allProductIds.length) {
    throw new Error('Invalid or inactive products in cart');
  }

  let variantsData: any[] = [];
  if (allVariantIds.length > 0) {
    const { data: vData, error: vError } = await supabase
      .from('product_variants')
      .select('id, product_id, price_override, stock_quantity')
      .in('id', allVariantIds);
    
    if (vError) throw new Error('Failed to fetch variants');
    variantsData = vData || [];
  }

  const productMap = new Map(productsData.map(p => [p.id, p]));
  const variantMap = new Map(variantsData.map(v => [v.id, v]));

  // 4. CALCULATE TOTALS & VALIDATE STOCK (Manifesto Point 8, 9)
  let subtotal = 0;
  const orderItems = [];
  const stockUpdates = [];

  for (const item of validatedItems) {
    const product = productMap.get(item.productId);
    if (!product || product.status !== 'active') {
      throw new Error(`Product ${item.productId} is unavailable`);
    }

    let unitPrice = Number(product.base_price);
    let currentStock = 999999; // Assume infinite for products without variants

    if (item.variantId) {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        throw new Error(`Invalid variant for product ${product.name}`);
      }
      unitPrice = variant.price_override ? Number(variant.price_override) : Number(product.base_price);
      currentStock = variant.stock_quantity;
    }

    if (currentStock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}. Only ${currentStock} left.`);
    }

    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;

    orderItems.push({
      product_name: product.name, // Match actual database column
      variant_id: item.variantId || null,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    });

    if (item.variantId) {
      stockUpdates.push({
        variantId: item.variantId,
        quantity: item.quantity,
        expectedStock: currentStock,
        productName: product.name
      });
    }
  }

  const shippingFee = 200; // Flat rate (can be made dynamic based on validatedShipping.city later)
  const total = subtotal + shippingFee;

  // 5. CREATE ORDER (Manifesto Point 8)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId || null, // Explicitly null for guests
      status: 'pending',
      subtotal,
      shipping_fee: shippingFee,
      total,
      shipping_address: validatedShipping, // Match actual database column name
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error('❌ DATABASE ERROR DETAILS:', JSON.stringify(orderError, null, 2));
    throw new Error('Database error: ' + (orderError?.message || 'Unknown DB error'));
  }

  // 6. CREATE ORDER ITEMS
  const itemsToInsert = orderItems.map(item => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);

  if (itemsError) {
    console.error('Order items creation failed:', itemsError);
    throw new Error('Failed to create order items');
  }

  // 7. ATOMIC STOCK DEDUCTION (Manifesto Point 9: Prevent Overselling)
  for (const update of stockUpdates) {
    const newStock = update.expectedStock - update.quantity;
    
    const { data: updated, error: updateError } = await supabase
      .from('product_variants')
      .update({ stock_quantity: newStock })
      .eq('id', update.variantId)
      .eq('stock_quantity', update.expectedStock); // Optimistic concurrency lock

    if (updateError || !updated) {
      // Race condition detected: stock changed between read and write
      console.error(`Race condition on stock update for variant ${update.variantId}`);
      throw new Error(`Inventory changed for ${update.productName} during checkout. Please try again.`);
    }
  }

  revalidatePath('/shop');
  redirect(`/payment?orderId=${order.id}`);
}
