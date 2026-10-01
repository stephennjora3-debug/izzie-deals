import fs from 'fs';
import path from 'path';

console.log('🔧 Implementing Brute Force Cart Clear...\n');

// 1. Create the Brute Force CartClearer component
const clearerDir = path.join('src', 'components', 'cart');
fs.mkdirSync(clearerDir, { recursive: true });
const clearerPath = path.join(clearerDir, 'CartClearer.tsx');

const clearerCode = `'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function CartClearer() {
  useEffect(() => {
    console.log('CartClearer mounted. Attempting to clear cart...');

    // 1. Get current state to see what methods exist
    const state = useCartStore.getState();
    
    // Try standard clear methods
    if (typeof state.clearCart === 'function') {
      state.clearCart();
    } else if (typeof state.reset === 'function') {
      state.reset();
    } else {
      // 2. Brute force: Reset the state object directly
      // We set all common cart state properties to empty/zero
      useCartStore.setState({ 
        items: [], 
        cart: [], 
        total: 0, 
        totalItems: 0, 
        quantity: 0 
      });
    }

    // 3. Nuke LocalStorage (Zustand Persist Fallback)
    // This ensures that even if the state update fails, the saved data is gone
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.toLowerCase().includes('cart') || key.toLowerCase().includes('store') || key.toLowerCase().includes('zustand'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('Cart cleared forcefully. Removed keys:', keysToRemove);
    
    // 4. Force a window reload to ensure UI updates everywhere (Header badge, etc.)
    // We use a small timeout to let the state clear first
    setTimeout(() => {
      window.location.reload();
    }, 100);

  }, []);

  return null;
}
`;

fs.writeFileSync(clearerPath, clearerCode, 'utf8');
console.log('✅ Created Brute Force CartClearer.');

// 2. Ensure it's in the Success Page
const successPath = path.join('src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

if (fs.existsSync(successPath)) {
  let code = fs.readFileSync(successPath, 'utf8');

  // Add import
  if (!code.includes("import CartClearer from '@/components/cart/CartClearer';")) {
    code = "import CartClearer from '@/components/cart/CartClearer';\n" + code;
  }

  // Add component inside the main container
  if (!code.includes('<CartClearer />')) {
    code = code.replace(
      /<div className="container mx-auto px-4 py-16">/,
      `<div className="container mx-auto px-4 py-16">
      <CartClearer />`
    );
    console.log('✅ Injected CartClearer into Success page.');
  } else {
    console.log('✅ CartClearer already present in Success page.');
  }

  fs.writeFileSync(successPath, code, 'utf8');
} else {
  console.log('⚠️ Success page not found at expected path. Checking alternatives...');
  // Fallback paths
  const altPaths = [
    path.join('src', 'app', 'checkout', 'success', 'page.tsx'),
    path.join('src', 'app', 'payment', 'page.tsx')
  ];
  for (const p of altPaths) {
    if (fs.existsSync(p)) {
      console.log('Found alternative success page at:', p);
      let code = fs.readFileSync(p, 'utf8');
      if (!code.includes("import CartClearer")) {
        code = "import CartClearer from '@/components/cart/CartClearer';\n" + code;
      }
      if (!code.includes('<CartClearer />')) {
         code = code.replace(/return \(/, `return (\n    <>\n    <CartClearer />\n    `);
         code = code.replace(/\);$/, `    </>\n  );`);
      }
      fs.writeFileSync(p, code, 'utf8');
      break;
    }
  }
}

console.log('\n🎉 Brute force cart clear implemented!');