import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Logo and replacing emojis with professional icons...\n');

// ==========================================
// 1. Fix Header Logo
// ==========================================
const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');
if (fs.existsSync(headerPath)) {
  let code = fs.readFileSync(headerPath, 'utf8');
  
  // Replace any text-based logo with the image
  code = code.replace(/>(Aura|Izzie Deals|Aura Commerce)</g, '><img src="/izzie.png" alt="Izzie Deals" className="h-8 md:h-10 w-auto object-contain" /><');
  
  // If it's inside a specific h1 or span, this catches it too
  code = code.replace(/<h1[^>]*>(Aura|Izzie Deals|Aura Commerce)<\/h1>/g, '<img src="/izzie.png" alt="Izzie Deals" className="h-8 md:h-10 w-auto object-contain" />');
  
  fs.writeFileSync(headerPath, code, 'utf8');
  console.log('✅ Updated Header with Izzie Deals logo.');
} else {
  console.log('⚠️ Header.tsx not found.');
}

// ==========================================
// 2. Fix Shipping Page (Remove Emojis, Add Lucide Icons)
// ==========================================
const shippingPath = path.join('src', 'app', 'shipping', 'page.tsx');
if (fs.existsSync(shippingPath)) {
  let code = fs.readFileSync(shippingPath, 'utf8');

  // 1. Add Lucide icon imports at the top
  if (!code.includes("from 'lucide-react'")) {
    code = "import { Truck, Package, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';\n" + code;
  } else {
    // Append to existing lucide import
    code = code.replace(
      /import \{([^}]+)\} from 'lucide-react';/,
      "import { $1, Truck, Package, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';"
    );
  }

  // 2. Replace emojis with professional icons
  code = code.replace(/<span className="bg-brand-100 text-brand-900 p-2 rounded-lg">🚚<\/span>/g, '<Truck className="w-6 h-6 text-brand-900" />');
  code = code.replace(/<span className="bg-brand-100 text-brand-900 p-2 rounded-lg">📦<\/span>/g, '<Package className="w-6 h-6 text-brand-900" />');
  code = code.replace(/<span className="bg-brand-100 text-brand-900 p-2 rounded-lg">📍<\/span>/g, '<MapPin className="w-6 h-6 text-brand-900" />');

  // 3. Replace the WhatsApp SVG with a clean Lucide icon
  code = code.replace(/<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">[\s\S]*?<\/svg>/g, '<MessageCircle className="w-5 h-5" />');

  fs.writeFileSync(shippingPath, code, 'utf8');
  console.log('✅ Replaced all emojis with Lucide icons on Shipping page.');
} else {
  console.log('⚠️ shipping/page.tsx not found.');
}

// ==========================================
// 3. Clean up any other emojis in recent files
// ==========================================
const waPath = path.join('src', 'components', 'layout', 'WhatsAppButton.tsx');
if (fs.existsSync(waPath)) {
  let code = fs.readFileSync(waPath, 'utf8');
  // Ensure it uses a clean SVG, no emojis
  if (code.includes('') || code.includes('📱')) {
    code = code.replace(/💬|/g, '');
    fs.writeFileSync(waPath, code, 'utf8');
    console.log('✅ Cleaned up WhatsApp button.');
  }
}

console.log('\n🎉 Logo and Icons fixed!');