import fs from 'fs';
import path from 'path';

const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');

if (!fs.existsSync(headerPath)) {
  console.log('Header not found');
  process.exit(1);
}

let code = fs.readFileSync(headerPath, 'utf8');

// Look for the Orders link
const ordersLinkMatch = code.match(/<Link[^>]*href="([^"]*admin[^"]*)"[^>]*>/g);

console.log('Found admin links in Header:');
if (ordersLinkMatch) {
  ordersLinkMatch.forEach((link, i) => {
    console.log(`${i + 1}. ${link}`);
  });
} else {
  console.log('No admin links found!');
}

// Make sure the link is exactly /admin/orders
const wrongLink = /<Link[^>]*href="\/admin\/orders"[^>]*>/;
if (!wrongLink.test(code)) {
  console.log('\n The Orders link might be malformed. Checking...');
  
  // Try to fix it
  code = code.replace(
    /<Link[^>]*href="[^"]*orders[^"]*"[^>]*>/g,
    '<Link href="/admin/orders" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-md transition-colors">'
  );
  
  fs.writeFileSync(headerPath, code, 'utf8');
  console.log('Fixed Orders link to be exactly /admin/orders');
} else {
  console.log('\n Orders link looks correct.');
}