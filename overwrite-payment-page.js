import fs from 'fs';
import path from 'path';

const pagePath = path.join(process.cwd(), 'src', 'app', 'payment', 'page.tsx');

console.log('Completely overwriting payment page with correct Server Component code...\n');

// This is the EXACT correct code for a Next.js Server Component that reads searchParams
const correctCode = `import CartClearer from '@/components/cart/CartClearer';
import PaymentClient from './PaymentClient';

export const dynamic = 'force-dynamic';

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  const orderId = params.orderId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <CartClearer />
      <PaymentClient orderId={orderId} />
    </div>
  );
}
`;

fs.writeFileSync(pagePath, correctCode, 'utf8');

console.log('✅ SUCCESS: Completely overwrote src/app/payment/page.tsx');
console.log('   There is NO "use server" directive. It is now a pure, correct Server Component.');