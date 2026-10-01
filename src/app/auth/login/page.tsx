'use client';

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
