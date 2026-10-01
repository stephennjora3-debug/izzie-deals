import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables...\n');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('1. Project URL:', url ? '✅ Found' : '❌ Missing');
console.log('2. Anon Key:', anonKey ? '✅ Found' : '❌ Missing');
console.log('3. Service Role Key:', serviceKey ? '✅ Found' : '❌ Missing');

if (!serviceKey) {
  console.log('\n⚠️ CRITICAL ISSUE: SUPABASE_SERVICE_ROLE_KEY is missing!');
  console.log('This is why the "Orders" and "Add Product" pages are stuck on "Rendering...".');
  console.log('\n👉 HOW TO FIX:');
  console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
  console.log('2. Click "Project Settings" (gear icon at the bottom left).');
  console.log('3. Click "API" in the sidebar.');
  console.log('4. Scroll down to "Project API keys".');
  console.log('5. Copy the key named "service_role" (it starts with eyJ...).');
  console.log('6. Open your .env.local file and add this line:');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_copied_key_here');
} else {
  console.log('\n✅ All keys found. The issue might be a server cache.');
}