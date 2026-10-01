import { Truck, Package, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button'; // Assuming you have this, if not, use a standard button

export const metadata = {
  title: 'Shipping & Delivery | Aura Commerce',
  description: 'Find out our delivery rates and times for Nairobi and other counties in Kenya.',
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">

      {/* Hero Section with Background Image */}
      <div className="relative h-64 md:h-80 w-full mb-12 rounded-xl overflow-hidden shadow-lg">
        <img 
          src="/shipping.jfif" 
          alt="Delivery Truck" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">Shipping & Delivery</h1>
          <p className="text-lg text-gray-200 drop-shadow-sm">Fast, reliable delivery across Kenya</p>
        </div>
      </div>
  
      

      <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-200 space-y-10">
        
        {/* Delivery Rates */}
        <section>
          <h2 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-2">
            <Truck className="w-6 h-6 text-brand-900" /> Delivery Rates
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
            <MapPin className="w-6 h-6 text-brand-900" /> Track Your Order
          </h2>
          <p className="text-brand-700 mb-4">
            Once your order is dispatched, you will receive an SMS and WhatsApp message with a tracking link and the rider's contact details. You can also check your order status anytime in your account dashboard.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t border-brand-200 pt-8 text-center">
          <h3 className="text-xl font-bold text-brand-900 mb-2">Have more questions about delivery?</h3>
          <p className="text-brand-600 mb-6">Our support team is available to help you. Call/WhatsApp: <strong>0748 440 083</strong> or <strong>0111651116</strong>.</p>
          <Link 
            href="https://wa.me/254748440083" 
            target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chat with us on WhatsApp
          </Link>
        </section>

      </div>
    </div>
  );
}
