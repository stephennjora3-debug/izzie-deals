import fs from 'fs';
import path from 'path';

const pagePath = path.join(process.cwd(), 'src', 'app', 'payment', 'page.tsx');

console.log('Fixing payment page...\n');

let content = fs.readFileSync(pagePath, 'utf8');

// Remove the incorrect 'use server' directive
if (content.includes("'use server';")) {
  content = content.replace("'use server';\n\n", "");
  fs.writeFileSync(pagePath, content, 'utf8');
  console.log('✅ SUCCESS: Removed incorrect "use server" directive.');
  console.log('   The file is now a standard Server Component, which is exactly what Next.js needs.');
} else {
  console.log('Directive not found, file is already correct.');
}