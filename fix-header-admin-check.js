import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'components', 'layout', 'Header.tsx');

console.log('Reading file: ' + filePath + '\n');

let content = fs.readFileSync(filePath, 'utf8');

// ANCHOR 1: Add imports for Supabase client and isAdmin utility
const OLD_IMPORTS = `'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Plus, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { SearchInput } from './SearchInput';
import { UserMenu } from './UserMenu';`;

const NEW_IMPORTS = `'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Plus, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { SearchInput } from './SearchInput';
import { UserMenu } from './UserMenu';
import { createClient } from '@/lib/supabase/client';
import { isAdmin } from '@/lib/admin';`;

if (!content.includes(OLD_IMPORTS)) {
  console.log("ANCHOR 1 NOT FOUND (Imports)");
  process.exit(1);
}
content = content.split(OLD_IMPORTS).join(NEW_IMPORTS);

// ANCHOR 2: Add admin check state and useEffect inside Header component
const OLD_HEADER_START = `export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-200 bg-white shadow-sm">`;

const NEW_HEADER_START = `export function Header() {
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && isAdmin(user.email)) {
        setIsAdminUser(true);
      }
    };
    checkAdmin();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-200 bg-white shadow-sm">`;

if (!content.includes(OLD_HEADER_START)) {
  console.log("ANCHOR 2 NOT FOUND (Header Start)");
  process.exit(1);
}
content = content.split(OLD_HEADER_START).join(NEW_HEADER_START);

// ANCHOR 3: Wrap Admin Links with isAdminUser check
const OLD_ADMIN_LINKS = `            {/* Admin Links */}
            <div className="hidden md:flex items-center gap-2 border-l border-brand-200 pl-4">
              <Link 
                href="/admin/orders" 
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-md transition-colors"
              >
                <Package className="h-4 w-4" />
                <span>Orders</span>
              </Link>
              <Link 
                href="/admin/add-product" 
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Link>
            </div>`;

const NEW_ADMIN_LINKS = `            {/* Admin Links */}
            {isAdminUser && (
              <div className="hidden md:flex items-center gap-2 border-l border-brand-200 pl-4">
                <Link 
                  href="/admin/orders" 
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-md transition-colors"
                >
                  <Package className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
                <Link 
                  href="/admin/add-product" 
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </Link>
              </div>
            )}`;

if (!content.includes(OLD_ADMIN_LINKS)) {
  console.log("ANCHOR 3 NOT FOUND (Admin Links)");
  process.exit(1);
}
content = content.split(OLD_ADMIN_LINKS).join(NEW_ADMIN_LINKS);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ SUCCESS: Updated Header.tsx');
console.log('   1. Added imports for createClient and isAdmin.');
console.log('   2. Added useEffect to check if the logged-in user is an admin.');
console.log('   3. Wrapped "Orders" and "Add Product" links in {isAdminUser && (...)}');
console.log('\nNow, regular shoppers will NOT see admin links, and non-admins are also blocked by proxy.ts!');