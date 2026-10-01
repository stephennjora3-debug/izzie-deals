import fs from 'fs';
import path from 'path';

console.log('🚀 Implementing Option A: WhatsApp Button & Shipping Page...\n');

// ==========================================
// 1. Create Floating WhatsApp Button
// ==========================================
const layoutDir = path.join('src', 'components', 'layout');
fs.mkdirSync(layoutDir, { recursive: true });
const waButtonPath = path.join(layoutDir, 'WhatsAppButton.tsx');

const waButtonCode = `'use client';

import Link from 'next/link';

export function WhatsAppButton() {
  // TODO: Replace this with your actual business WhatsApp number (format: 2547...)
  const phoneNumber = "254712345678"; 
  const message = "Hello Aura Commerce, I have a question about your products.";
  const waLink = \`https://wa.me/\${phoneNumber}?text=\${encodeURIComponent(message)}\`;

  return (
    <Link
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse animation ring */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
      
      {/* WhatsApp Icon */}
      <svg className="relative w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    </Link>
  );
}
`;

fs.writeFileSync(waButtonPath, waButtonCode, 'utf8');
console.log('✅ Created Floating WhatsApp Button.');

// ==========================================
// 2. Inject WhatsApp Button into Main Layout
// ==========================================
const layoutPath = path.join('src', 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  let code = fs.readFileSync(layoutPath, 'utf8');
  
  // Add import
  if (!code.includes("import { WhatsAppButton } from '@/components/layout/WhatsAppButton';")) {
    code = "import { WhatsAppButton } from '@/components/layout/WhatsAppButton';\n" + code;
  }

  // Add component before the closing </body> tag
  if (!code.includes('<WhatsAppButton />')) {
    code = code.replace(/<\/body>/, '<WhatsAppButton />\n  </body>');
    console.log('✅ Injected WhatsApp Button into layout.tsx.');
  }
  fs.writeFileSync(layoutPath, code, 'utf8');
} else {
  console.log('️ Could not find layout.tsx. You may need to add <WhatsAppButton /> manually.');
}

// ==========================================
// 3. Create Shipping/Delivery Page
// ==========================================
const shippingDir = path.join('src', 'app', 'shipping');
fs.mkdirSync(shippingDir, { recursive: true });
const shippingPath = path.join(shippingDir, 'page.tsx');

const shippingCode = `import Link from 'next/link';
import { Button } from '@/components/ui/Button'; // Assuming you have this, if not, use a standard button

export const metadata = {
  title: 'Shipping & Delivery | Aura Commerce',
  description: 'Find out our delivery rates and times for Nairobi and other counties in Kenya.',
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-900 mb-4">Shipping & Delivery Information</h1>
        <p className="text-lg text-brand-600">Fast, reliable delivery across Kenya.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-200 space-y-10">
        
        {/* Delivery Rates */}
        <section>
          <h2 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-2">
            <span className="bg-brand-100 text-brand-900 p-2 rounded-lg">🚚</span> Delivery Rates
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-brand-200">
                  <th className="py-3 px-4 font-semibold text-brand-900">Location</th>
                  <th className="py-3 px-4 font-semibold text-brand-900">Delivery Fee</th>
                  <th className="py-3 px-4 font-semibold text-brand-900">Estimated Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                <tr>
                  <td className="py-4 px-4 text-brand-700">Nairobi (Within CBD & Immediate Environs)</td>
                  <td className="py-4 px-4 font-bold text-brand-900">Ksh 200</td>
                  <td className="py-4 px-4 text-brand-600">Same Day / Next Day</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-brand-700">Nairobi (Outskirts: Rongai, Kitengela, etc.)</td>
                  <td className="py-4 px-4 font-bold text-brand-900">Ksh 350</td>
                  <td className="py-4 px-4 text-brand-600">1 - 2 Days</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-brand-700">Other Major Towns (Mombasa, Kisumu, Nakuru, Eldoret)</td>
                  <td className="py-4 px-4 font-bold text-brand-900">Ksh 500</td>
                  <td className="py-4 px-4 text-brand-600">2 - 3 Days</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-brand-700">Other Counties / Remote Areas</td>
                  <td className="py-4 px-4 font-bold text-brand-900">Ksh 700+</td>
                  <td className="py-4 px-4 text-brand-600">3 - 5 Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Policies */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-brand-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-brand-900 mb-3">📦 Order Processing</h3>
            <p className="text-brand-700 leading-relaxed">
              Orders placed before 12:00 PM on business days are processed and dispatched the same day. Orders placed on weekends or public holidays will be processed on the next business day.
            </p>
          </div>
          <div className="bg-brand-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-brand-900 mb-3">📍 Pickup Option</h3>
            <p className="text-brand-700 leading-relaxed">
              Prefer to collect your order? You can select "Self Pickup" at checkout. Our store is located in Nairobi CBD. We will notify you via WhatsApp when your order is ready.
            </p>
          </div>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="text-2xl font-bold text-brand-900 mb-4 flex items-center gap-2">
            <span className="bg-brand-100 text-brand-900 p-2 rounded-lg">📍</span> Track Your Order
          </h2>
          <p className="text-brand-700 mb-4">
            Once your order is dispatched, you will receive an SMS and WhatsApp message with a tracking link and the rider's contact details. You can also check your order status anytime in your account dashboard.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t border-brand-200 pt-8 text-center">
          <h3 className="text-xl font-bold text-brand-900 mb-2">Have more questions about delivery?</h3>
          <p className="text-brand-600 mb-6">Our support team is available on WhatsApp to help you.</p>
          <Link 
            href="https://wa.me/254712345678" 
            target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Chat with us on WhatsApp
          </Link>
        </section>

      </div>
    </div>
  );
}
`;

fs.writeFileSync(shippingPath, shippingCode, 'utf8');
console.log('✅ Created /shipping page.');

// ==========================================
// 4. Add Link to Footer (If Footer exists)
// ==========================================
const footerPath = path.join('src', 'components', 'layout', 'Footer.tsx');
if (fs.existsSync(footerPath)) {
  let code = fs.readFileSync(footerPath, 'utf8');
  
  // Look for a "Shop" or "Support" section to add the link
  if (code.includes('Shipping Policy') || code.includes('/shipping')) {
    console.log('✅ Shipping link already exists in Footer.');
  } else {
    // Try to find a list of links to append to
    const listRegex = /(<ul[^>]*>[\s\S]*?<\/ul>)/;
    const match = code.match(listRegex);
    if (match) {
      const newLink = `\n            <li><Link href="/shipping" className="text-brand-600 hover:text-brand-900 transition-colors">Shipping & Delivery</Link></li>`;
      code = code.replace(match[0], match[0].replace('</ul>', newLink + '\n          </ul>'));
      fs.writeFileSync(footerPath, code, 'utf8');
      console.log('✅ Added Shipping link to Footer.');
    } else {
      console.log('⚠️ Could not find a list in Footer to add the link. You may need to add it manually.');
    }
  }
} else {
  console.log('⚠️ Footer.tsx not found. You may need to add a link to /shipping manually.');
}

console.log('\n Option A implemented successfully!');