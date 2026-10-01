import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, HelpCircle, Truck, RotateCcw, Shield } from 'lucide-react';

export default function CustomerServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-900 mb-4">Customer Service</h1>
        <p className="text-xl text-brand-600 mb-12">We're here to help! Choose how you'd like to contact us.</p>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md border border-brand-100">
            <Phone className="h-8 w-8 text-brand-600 mb-4" />
            <h3 className="text-lg font-bold text-brand-900 mb-2">Call Us</h3>
            <p className="text-brand-600 mb-4">Mon-Fri: 8am - 6pm EAT</p>
            <a href="tel:+254700000000" className="text-brand-600 hover:text-brand-900 font-semibold">
              +254 700 000 000
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-brand-100">
            <Mail className="h-8 w-8 text-brand-600 mb-4" />
            <h3 className="text-lg font-bold text-brand-900 mb-2">Email Us</h3>
            <p className="text-brand-600 mb-4">We'll respond within 24 hours</p>
            <a href="mailto:support@izzie-deals.com" className="text-brand-600 hover:text-brand-900 font-semibold">
              support@izzie-deals.com
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-brand-100">
            <MessageCircle className="h-8 w-8 text-brand-600 mb-4" />
            <h3 className="text-lg font-bold text-brand-900 mb-2">WhatsApp</h3>
            <p className="text-brand-600 mb-4">Chat with us instantly</p>
            <a href="https://wa.me/254700000000" className="text-brand-600 hover:text-brand-900 font-semibold">
              Start Chat
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <h2 className="text-3xl font-bold text-brand-900 mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-brand-100">
            <div className="flex items-start gap-4">
              <Truck className="h-6 w-6 text-brand-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-brand-900 mb-2">Shipping & Delivery</h3>
                <p className="text-brand-600 mb-2">We offer free shipping on orders over KES 5,000. Standard delivery takes 2-4 business days within Nairobi, and 3-5 days for upcountry orders.</p>
                <Link href="/shipping" className="text-brand-600 hover:text-brand-900 font-semibold text-sm">
                  View Shipping Policy →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-brand-100">
            <div className="flex items-start gap-4">
              <RotateCcw className="h-6 w-6 text-brand-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-brand-900 mb-2">Returns & Refunds</h3>
                <p className="text-brand-600 mb-2">You can return items within 30 days of delivery for a full refund. Items must be unused and in original packaging.</p>
                <Link href="/returns" className="text-brand-600 hover:text-brand-900 font-semibold text-sm">
                  View Return Policy →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-brand-100">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-brand-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-brand-900 mb-2">Payment Security</h3>
                <p className="text-brand-600 mb-2">We accept M-Pesa, Visa, Mastercard, and bank transfers. All transactions are encrypted and secure.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-brand-100">
            <div className="flex items-start gap-4">
              <HelpCircle className="h-6 w-6 text-brand-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-brand-900 mb-2">Order Tracking</h3>
                <p className="text-brand-600 mb-2">Once your order ships, you'll receive an SMS with tracking details. You can also track your order in your account dashboard.</p>
                <Link href="/auth/login" className="text-brand-600 hover:text-brand-900 font-semibold text-sm">
                  Login to Track Order →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
