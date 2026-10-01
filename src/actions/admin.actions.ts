'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function deleteOrder(orderId: string) {
  const supabase = createAdminClient();

  // First delete order items
  const { error: itemsError } = await supabase
    .from('order_items')
    .delete()
    .eq('order_id', orderId);

  if (itemsError) {
    console.error('Error deleting order items:', itemsError);
    throw new Error(itemsError.message);
  }

  // Then delete the order
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) {
    console.error('Error deleting order:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function generateReceipt(orderId: string) {
  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        unit_price,
        total_price,
        product_variants (
          product_id,
          attributes
        )
      )
    `)
    .eq('id', orderId)
    .single();

  if (error || !order) {
    throw new Error('Order not found');
  }

  return order;
}
