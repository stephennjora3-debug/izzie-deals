'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/actions/auth.actions';

export function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Use getSession() to read the auth cookie directly
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    
    checkSession();

    // Listen for auth changes (login/logout events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
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
