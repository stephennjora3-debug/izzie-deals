import fs from 'fs';
import path from 'path';

const headerPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Header.tsx');

console.log('Fixing header search placeholder and navigation links...\n');

let content = fs.readFileSync(headerPath, 'utf8');

// Fix search placeholder
content = content.replace('placeholder="Search Izzie Deals"', 'placeholder="Search products..."');

// Fix navigation links
content = content.replace('href="/shop"', 'href="/shop?on_sale=true"').replace("Today's Deals", "Today's Deals");
content = content.replace('href="/shipping"', 'href="/customer-service"').replace('Customer Service', 'Customer Service');
content = content.replace('href="/shop"', 'href="/gift-cards"').replace('Gift Cards', 'Gift Cards');
content = content.replace('href="/shop"', 'href="/sell"').replace('Sell', 'Sell');

fs.writeFileSync(headerPath, content, 'utf8');

console.log('✅ SUCCESS: Fixed search placeholder and navigation links.');