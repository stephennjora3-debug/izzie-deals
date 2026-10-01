import { Suspense } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrintButton } from '@/components/ui/PrintButton';
import { DownloadPDFButton } from '@/components/ui/DownloadPDFButton';

async function ReceiptContent({ orderId }: { orderId: string }) {
  const supabase = createAdminClient();
  
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (error || !order) notFound();

  const { data: allProducts } = await supabase.from('products').select('id, name, price');
  const priceToName: Record<number, string> = {};
  if (allProducts) {
    allProducts.forEach((p: any) => { priceToName[p.price] = p.name; });
  }

  const shopUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(shopUrl)}`;

  return (
    <>
      {/* Native Print Styles - This makes the PDF look perfect */}
      

      <div className="min-h-screen bg-gray-100 py-8 px-4 flex justify-center">
        <div className="w-full max-w-[380px]">
          
          {/* Controls (Hidden on print) */}
          <div className="mb-6 flex justify-between items-center no-print">
            <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-900">&larr; Back</Link>
            <div className="flex gap-2">
              <DownloadPDFButton />
              <PrintButton />
            </div>
          </div>

          {/* Receipt Container */}
          <div id="receipt-content" className="bg-white p-6 shadow-sm font-mono text-xs text-gray-900 uppercase leading-tight">
            
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold tracking-widest mb-1">IZZIE DEALS</h1>
              <p className="text-[10px] text-gray-600">Premium Multi-Category Store</p>
              <p className="text-[10px] text-gray-600">Nairobi, Kenya</p>
              <img src={qrCodeUrl} alt="Shop QR" className="mx-auto mt-3 w-20 h-20" />
            </div>

            <div className="border-b-2 border-dashed border-gray-400 my-3"></div>

            <div className="flex justify-between mb-2"><span>Receipt #:</span><span>{order.id.slice(0, 8).toUpperCase()}</span></div>
            <div className="flex justify-between mb-2"><span>Date:</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
            <div className="flex justify-between mb-2"><span>Time:</span><span>{new Date(order.created_at).toLocaleTimeString()}</span></div>

            <div className="border-b-2 border-dashed border-gray-400 my-3"></div>

            <div className="mb-3">
              <p className="font-bold mb-1">Customer:</p>
              <p>{order.shipping_address?.fullName || 'Guest'}</p>
              <p>{order.shipping_address?.phone}</p>
              <p>{order.shipping_address?.addressLine1}</p>
            </div>

            <div className="border-b-2 border-dashed border-gray-400 my-3"></div>

            <div className="mb-3">
              <div className="flex justify-between font-bold border-b border-gray-300 pb-1 mb-2">
                <span className="w-1/2">Item</span>
                <span className="w-1/6 text-right">Qty</span>
                <span className="w-1/3 text-right">Total</span>
              </div>
              
              {order.order_items?.map((item: any, idx: number) => {
                let displayName = item.product_name;
                if (!displayName && priceToName[item.unit_price]) {
                  displayName = priceToName[item.unit_price];
                }
                if (!displayName) displayName = 'Unknown Product';

                return (
                  <div key={idx} className="flex justify-between mb-2 break-words">
                    <span className="w-1/2 pr-2 normal-case capitalize">{displayName}</span>
                    <div className="flex flex-col items-end w-1/2">
                      <span className="text-[10px] text-gray-500">{item.quantity} x {formatCurrency(item.unit_price, 'KES')}</span>
                      <span className="font-bold">{formatCurrency(item.total_price, 'KES')}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-b-2 border-dashed border-gray-400 my-3"></div>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.total, 'KES')}</span></div>
              <div className="flex justify-between"><span>Tax (0%)</span><span>0.00</span></div>
              <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-gray-300">
                <span>TOTAL</span><span>{formatCurrency(order.total, 'KES')}</span>
              </div>
            </div>

            <div className="border-b-2 border-dashed border-gray-400 my-3"></div>

            <div className="text-center mt-4 normal-case">
              <p className="font-bold mb-1">Thank you for shopping!</p>
              <p className="text-[10px] text-gray-500">Goods once sold are not returnable.</p>
              <p className="text-[10px] text-gray-500 mt-2">Status: {order.status}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default async function ReceiptPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  if (!params.orderId) notFound();
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono">Loading receipt...</div>}>
      <ReceiptContent orderId={params.orderId} />
    </Suspense>
  );
}
