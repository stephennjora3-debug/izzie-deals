import fs from 'fs';
import path from 'path';

console.log('🔍 Searching for cart and checkout files...\n');

function findFile(dir, fileName) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.next') {
      const result = findFile(fullPath, fileName);
      if (result) return result;
    } else if (file.name === fileName) {
      return fullPath;
    }
  }
  return null;
}

// 1. Find Cart Store
const cartStorePath = findFile('src', 'cartStore.ts') || findFile('src', 'cartStore.js');
if (cartStorePath) {
  console.log('✅ Found Cart Store:', cartStorePath);
  console.log('--- CONTENTS ---');
  console.log(fs.readFileSync(cartStorePath, 'utf8'));
  console.log('----------------\n');
} else {
  console.log('❌ Could not find cartStore.ts/js');
}

// 2. Find Checkout Page
const checkoutPagePath = findFile('src', 'page.tsx'); // We'll filter for checkout
// Actually, let's just search for files containing "checkout"
function findCheckout(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.next') {
      const result = findCheckout(fullPath);
      if (result) return result;
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('checkout') || content.includes('placeOrder')) {
        return fullPath;
      }
    }
  }
  return null;
}

const checkoutPath = findCheckout('src');
if (checkoutPath) {
  console.log('✅ Found Checkout File:', checkoutPath);
  console.log('--- CONTENTS ---');
  console.log(fs.readFileSync(checkoutPath, 'utf8'));
  console.log('----------------\n');
} else {
  console.log('❌ Could not find checkout file');
}