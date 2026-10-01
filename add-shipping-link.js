import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'components', 'layout', 'Header.tsx');

console.log('Reading file: ' + filePath + '\n');

let content = fs.readFileSync(filePath, 'utf8');

// EXACT ANCHOR: The main navigation block in Header.tsx
const OLD_NAV = `          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="text-sm font-medium text-brand-700 hover:text-brand-900">Shop</Link>
            <Link href="/shop?category=Clothing" className="text-sm font-medium text-brand-700 hover:text-brand-900">Clothing</Link>
            <Link href="/shop?category=Electronics" className="text-sm font-medium text-brand-700 hover:text-brand-900">Electronics</Link>
          </nav>`;

const NEW_NAV = `          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="text-sm font-medium text-brand-700 hover:text-brand-900">Shop</Link>
            <Link href="/shop?category=Clothing" className="text-sm font-medium text-brand-700 hover:text-brand-900">Clothing</Link>
            <Link href="/shop?category=Electronics" className="text-sm font-medium text-brand-700 hover:text-brand-900">Electronics</Link>
            <Link href="/shipping" className="text-sm font-medium text-brand-700 hover:text-brand-900">Shipping</Link>
          </nav>`;

if (!content.includes(OLD_NAV)) {
  console.log("ANCHOR NOT FOUND. The file content might have changed.");
  console.log("Looking for exactly:");
  console.log(OLD_NAV);
  process.exit(1);
}

// Safe replacement
content = content.split(OLD_NAV).join(NEW_NAV);
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ SUCCESS: Updated Header.tsx');
console.log('   Added "Shipping" link to the main navigation bar.');