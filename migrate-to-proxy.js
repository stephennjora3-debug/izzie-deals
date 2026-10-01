import fs from 'fs';
import path from 'path';

const oldPath = path.join(process.cwd(), 'src', 'middleware.ts');
const newPath = path.join(process.cwd(), 'src', 'proxy.ts');

console.log('Migrating middleware.ts to proxy.ts for Next.js 16...\n');

if (fs.existsSync(oldPath)) {
  let content = fs.readFileSync(oldPath, 'utf8');
  
  // Change the export name from 'middleware' to 'proxy'
  if (content.includes('export async function middleware')) {
    content = content.replace('export async function middleware', 'export async function proxy');
    fs.writeFileSync(newPath, content, 'utf8');
    fs.unlinkSync(oldPath); // Delete the old file
    console.log('✅ SUCCESS: Renamed src/middleware.ts to src/proxy.ts');
    console.log('   Updated export to "proxy" to match Next.js 16 standards.');
  } else {
    console.log('⚠️ Could not find "export async function middleware" to replace.');
  }
} else {
  console.log('⚠️ src/middleware.ts not found. Nothing to migrate.');
}