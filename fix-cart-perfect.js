import fs from 'fs';
import path from 'path';

console.log('🔧 Reading your actual cart store to fix clearing...\n');

// 1. Find the cart store file
const possiblePaths = [
  path.join('src', 'store', 'cartStore.ts'),
  path.join('src', 'store', 'cartStore.js'),
  path.join('src', 'lib', 'cartStore.ts'),
  path.join('src', 'lib', 'cartStore.js')
];

let storePath = null;
let storeCode = '';

for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    storePath = p;
    storeCode = fs.readFileSync(p, 'utf8');
    console.log('✅ Found cart store at:', p);
    break;
  }
}

if (!storePath) {
  console.error('❌ Could not find cartStore.ts. Please tell me where it is.');
  process.exit(1);
}

// 2. Analyze the store to find the clear method and state shape
const hasClearCart = storeCode.includes('clearCart');
const hasReset = storeCode.includes('reset');
const hasItems = storeCode.includes('items:');
const hasCart = storeCode.includes('cart:');

console.log('Store analysis:');
console.log('- Has clearCart method:', hasClearCart);
console.log('- Has reset method:', hasReset);
console.log('- Uses "items" array:', hasItems);
console.log('- Uses "cart" array:', hasCart);

// 3. Create the perfect CartClearer component
const clearerDir = path.join('src', 'components', 'cart');
fs.mkdirSync(clearerDir, { recursive: true });
const clearerPath = path.join(clearerDir, 'CartClearer.tsx');

let clearLogic = '';
if (hasClearCart) {
  clearLogic = `useCartStore.getState().clearCart();`;
} else if (hasReset) {
  clearLogic = `useCartStore.getState().reset();`;
} else {
  // Brute force state reset
  const stateObj = [];
  if (hasItems) stateObj.push('items: []');
  if (hasCart) stateObj.push('cart: []');
  stateObj.push('total: 0', 'totalItems: 0');
  clearLogic = `useCartStore.setState({ ${stateObj.join(', ')} });`;
}

const clearerCode = `'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function CartClearer() {
  useEffect(() => {
    console.log('CartClearer running...');
    
    // 1. Clear the Zustand state
    ${clearLogic}

    // 2. Nuke LocalStorage (Zustand Persist)
    // We look for any key that might be storing the cart
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.toLowerCase().includes('cart') || key.toLowerCase().includes('store') || key.toLowerCase().includes('zustand'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('Cart cleared. Removed keys:', keysToRemove);
    
    // 3. Force reload to update header badge
    setTimeout(() => {
      window.location.href = window.location.pathname; // Reload current page without query params if possible, or just reload
      window.location.reload();
    }, 50);

  }, []);

  return null;
}
`;

fs.writeFileSync(clearerPath, clearerCode, 'utf8');
console.log('✅ Created perfect CartClearer based on your store.');

// 4. Ensure it's in the Success Page
const successPath = path.join('src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');
if (fs.existsSync(successPath)) {
  let code = fs.readFileSync(successPath, 'utf8');
  if (!code.includes("import CartClearer from '@/components/cart/CartClearer';")) {
    code = "import CartClearer from '@/components/cart/CartClearer';\n" + code;
  }
  if (!code.includes('<CartClearer />')) {
    code = code.replace(/<div className="container mx-auto px-4 py-16">/, `<div className="container mx-auto px-4 py-16">\n      <CartClearer />`);
  }
  fs.writeFileSync(successPath, code, 'utf8');
  console.log('✅ Injected CartClearer into Success page.');
}

console.log('\n🎉 Cart fix complete!');