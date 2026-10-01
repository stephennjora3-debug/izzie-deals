'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }
  
  redirect('/shop');
}

export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    
    if (error) {
      return { error: error.message };
    }
    
    return { success: true, message: 'Account created! Please check your email to confirm.' };
  } catch (err) {
    console.error('Sign up error:', err);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/shop');
}
