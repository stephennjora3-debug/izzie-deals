import fs from 'fs';
import path from 'path';

console.log('Creating Auth pages with password toggles...');

// 1. Force create directories
const loginDir = path.join('src', 'app', 'auth', 'login');
const signupDir = path.join('src', 'app', 'auth', 'signup');

fs.mkdirSync(loginDir, { recursive: true });
fs.mkdirSync(signupDir, { recursive: true });

// 2. Write Login Page
const loginPath = path.join(loginDir, 'page.tsx');
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
console.log('1. Created Login page.');

// 3. Write Signup Page
const signupPath = path.join(signupDir, 'page.tsx');
const signupContent = `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError('');
    setMessage('');
    
    const result = await signUp(formData);
    
    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setMessage(result.message || 'Account created! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-brand-200">
        <h1 className="text-2xl font-bold text-brand-900 mb-6 text-center">Create Account</h1>
        
        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Full Name</label>
            <Input name="fullName" required placeholder="John Doe" />
          </div>
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
                minLength={6} 
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
          
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-brand-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(signupPath, signupContent, 'utf8');
console.log('2. Created Signup page.');

console.log('\n✅ Auth pages created successfully!');