import fs from 'fs';
import path from 'path';

const paymentPath = path.join(process.cwd(), 'src', 'app', 'payment', 'page.tsx');

console.log('Fixing /payment page prerendering error...\n');

if (!fs.existsSync(paymentPath)) {
  console.log('WARNING: Payment page not found at ' + paymentPath);
  // Try alternative path
  const altPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'payment', 'page.tsx');
  if (fs.existsSync(altPath)) {
    console.log('Found at alternative path. Fixing...');
    fixFile(altPath);
  } else {
    console.log('Could not find payment page. Please check the path.');
    process.exit(1);
  }
} else {
  fixFile(paymentPath);
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if it already has the dynamic export
  if (content.includes("export const dynamic = 'force-dynamic';")) {
    console.log('✅ Already configured as dynamic.');
    return;
  }

  // Add the dynamic export at the very top of the file
  const NEW_CONTENT = `export const dynamic = 'force-dynamic';\n\n${content}`;
  
  fs.writeFileSync(filePath, NEW_CONTENT, 'utf8');
  console.log('✅ SUCCESS: Added "force-dynamic" to ' + filePath);
  console.log('   This prevents Next.js from trying to statically prerender the page and causing the useSearchParams error.');
}