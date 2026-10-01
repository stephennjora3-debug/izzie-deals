import fs from 'fs';
import path from 'path';

const shopPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'shop', 'page.tsx');

console.log('Adding more categories to shop page...\n');

let content = fs.readFileSync(shopPath, 'utf8');

// Find the categories section and add more
const oldCategories = `  const categories = ['All', 'Clothing', 'Electronics', 'Accessories', 'Shoes', 'Home'];`;
const newCategories = `  const categories = ['All', 'Clothing', 'Electronics', 'Accessories', 'Shoes', 'Home', 'Kitchen Ware', 'Beauty', 'Sports', 'Books', 'Toys', 'Office Supplies'];`;

if (content.includes(oldCategories)) {
  content = content.replace(oldCategories, newCategories);
  console.log('✅ Added more categories to shop page.');
} else {
  console.log('⚠️ Could not find categories array. Manual update may be needed.');
}

fs.writeFileSync(shopPath, content, 'utf8');