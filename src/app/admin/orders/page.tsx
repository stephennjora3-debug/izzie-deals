import { createAdminClient } from '@/lib/supabase/admin';
import OrdersList from './OrdersList';

export const metadata = {
  title: 'Order Management | Admin',
};

async function fetchData() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return data || [];
}

export default async function AdminOrdersPage() {
  const initialOrders = await fetchData();
  return <OrdersList initialOrders={initialOrders} />;
}
