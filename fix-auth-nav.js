import fs from 'fs';
import path from 'path';

console.log('Fixing navigation and adding password toggle...');

// 1. Create a UserMenu client component (handles auth without breaking nav)
const userMenuPath = path.join('src', 'components', 'layout', 'UserMenu.tsx');
const userMenuContent = `'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/actions/auth.actions';

export function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="w-16 h-4 bg-brand-100 rounded animate-pulse" />;
  }

  if (user) {
    return (
      <form action={signOut}>
        <button type="submit" className="text-sm font-medium text-brand-700 hover:text-red-600 transition-colors">
          Logout
        </button>
      </form>
    );
  }

  return (
    <Link href="/auth/login" className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors">
      Login
    </Link>
  );
}
`;
fs.mkdirSync(path.dirname(userMenuPath), { recursive: true });
fs.writeFileSync(userMenuPath, userMenuContent, 'utf8');
console.log('1. Created UserMenu client component.');

// 2. Revert Header to simple sync component
const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');
const cleanHeader = `'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Plus, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { SearchInput } from './SearchInput';
import { UserMenu } from './UserMenu';

function CartBadge() {
  const totalItems = useCartStore((state) => state.totalItems());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;
  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-900 text-[10px] font-bold text-white">
      {totalItems > 99 ? '99+' : totalItems}
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-brand-900">
            Aura
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="text-sm font-medium text-brand-700 hover:text-brand-900">Shop</Link>
            <Link href="/shop?category=Clothing" className="text-sm font-medium text-brand-700 hover:text-brand-900">Clothing</Link>
            <Link href="/shop?category=Electronics" className="text-sm font-medium text-brand-700 hover:text-brand-900">Electronics</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <SearchInput />
            
            {/* Admin Links */}
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

            {/* User Menu (Login/Logout) */}
            <UserMenu />

            {/* Cart */}
            <Link href="/cart" className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-brand-100 h-10 w-10">
              <ShoppingCart className="h-5 w-5" />
              <CartBadge />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
`;
fs.writeFileSync(headerPath, cleanHeader, 'utf8');
console.log('2. Reverted Header to simple client component.');

// 3. Update Login page with password toggle
const loginPath = path.join('src', 'app', 'auth', 'login', 'page.tsx');
const loginContent = `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from '@/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-brand-200">
        <h1 className="text-2xl font-bold text-brand-900 mb-6 text-center">Welcome Back</h1>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Email</label>
            <Input name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Password</label>
            <div className="relative">
              <Input 
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                required 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <Button type="submit" size="lg" className="w-full">Sign In</Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-brand-900 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(loginPath, loginContent, 'utf8');
console.log('3. Updated Login page with password toggle.');

// 4. Update Signup page with password toggle
const signupPath = path.join('src', 'app', 'auth', 'signup', 'page.tsx');
let signupCode = fs.readFileSync(signupPath, 'utf8');

// Add Eye icons to import
signupCode = signupCode.replace(
  "import { Button } from '@/components/ui/Button';",
  "import { Button } from '@/components/ui/Button';\nimport { Eye, EyeOff } from 'lucide-react';"
);

// Add showPassword state
signupCode = signupCode.replace(
  "const [loading, setLoading] = useState(false);",
  "const [loading, setLoading] = useState(false);\n  const [showPassword, setShowPassword] = useState(false);"
);

// Replace the password Input with toggle version
signupCode = signupCode.replace(
  /<Input name="password" type="password" required minLength=\{6\} placeholder="••••••••" \/>/,
  `<div className="relative">
            <Input name="password" type={showPassword ? 'text' : 'password'} required minLength={6} placeholder="••••••••" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>`
);

fs.writeFileSync(signupPath, signupCode, 'utf8');
console.log('4. Updated Signup page with password toggle.');

console.log('\n All fixes applied!');