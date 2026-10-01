import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing cart clearing issue...\n');

// 1. Create the ClearCartOnSuccess component
const clearCartDir = path.join('src', 'components', 'cart');
fs.mkdirSync(clearCartDir, { recursive: true });
const clearCartPath = path.join(clearCartDir, 'ClearCartOnSuccess.tsx');

const clearCartCode = `'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export function ClearCartOnSuccess() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Automatically clear the cart when this page loads
    clearCart();
  }, [clearCart]);

  return null;
}
`;

fs.writeFileSync(clearCartPath, clearCartCode, 'utf8');
console.log('✅ Created ClearCartOnSuccess component.');

// 2. Inject it into the Success Page
const successPath = path.join('src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

if (fs.existsSync(successPath)) {
  let code = fs.readFileSync(successPath, 'utf8');

  // Add import if not present
  if (!code.includes("import { ClearCartOnSuccess } from '@/components/cart/ClearCartOnSuccess';")) {
    code = "import { ClearCartOnSuccess } from '@/components/cart/ClearCartOnSuccess';\n" + code;
  }

  // Add the component inside the main container (right after the opening div)
  if (!code.includes('<ClearCartOnSuccess />')) {
    code = code.replace(
      /<div className="container mx-auto px-4 py-16">/,
      `<div className="container mx-auto px-4 py-16">
      <ClearCartOnSuccess />`
    );
    console.log('✅ Injected ClearCartOnSuccess into the Success page.');
  }

  fs.writeFileSync(successPath, code, 'utf8');
} else {
  console.log('⚠️ Could not find success page. Please check the path.');
}

console.log('\n🎉 Cart clearing logic added!');