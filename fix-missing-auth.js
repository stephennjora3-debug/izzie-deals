import fs from 'fs';
import path from 'path';

const actionsDir = path.join('src', 'actions');
const authActionsPath = path.join(actionsDir, 'auth.actions.ts');

fs.mkdirSync(actionsDir, { recursive: true });

const authActionsContent = `'use server';

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
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/shop');
}
`;

fs.writeFileSync(authActionsPath, authActionsContent, 'utf8');
console.log('✅ Created src/actions/auth.actions.ts successfully!');