'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, MessageCircle, Camera } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Izzie Deals</h3>
            <p className="text-brand-300 text-sm leading-relaxed">
              Premium multi-category store offering curated clothing, electronics, and home goods with exceptional quality.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Globe className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><MessageCircle className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Camera className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-brand-300">
              <li><Link href="/shop?category=All" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=Clothing" className="hover:text-white transition-colors">Clothing</Link></li>
              <li><Link href="/shop?category=Electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/shop?category=Accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-brand-300">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-brand-300 mb-4">Subscribe to get special offers and updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 bg-brand-800 border border-brand-700 rounded-md px-3 py-2 text-sm text-white placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button className="bg-brand-100 text-brand-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-white transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-800 mt-12 pt-8 text-center text-sm text-brand-400">
          <p>&copy; {new Date().getFullYear()} Izzie Deals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
