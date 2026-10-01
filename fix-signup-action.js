import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/actions/auth.actions.ts');

console.log('Reading file: ' + filePath + '\n');

let content = fs.readFileSync(filePath, 'utf8');

// EXACT ANCHOR: The current signUp function without error handling
const OLD = `export async function signUp(formData: FormData) {
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
}`;

// NEW: signUp function with try/catch to prevent silent hangs
const NEW = `export async function signUp(formData: FormData) {
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
}`;

if (!content.includes(OLD)) {
  console.log("ANCHOR NOT FOUND. The file content might have changed.");
  console.log("Looking for exactly:");
  console.log(OLD);
  process.exit(1);
}

// Safe replacement
content = content.split(OLD).join(NEW);
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ SUCCESS: Updated auth.actions.ts');
console.log('   Added try/catch block to signUp function.');
console.log('   This prevents the server action from silently hanging and ensures loading state always resets.');