import fs from 'fs';
import path from 'path';

const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');

console.log('Updating main layout to include Mobile Bottom Nav...\n');

let content = fs.readFileSync(layoutPath, 'utf8');

// 1. Add the import
const IMPORT = `import { MobileBottomNav } from '@/components/layout/MobileBottomNav';`;
if (!content.includes(IMPORT)) {
  content = content.replace("import { Footer } from '@/components/layout/Footer';", "import { Footer } from '@/components/layout/Footer';\nimport { MobileBottomNav } from '@/components/layout/MobileBottomNav';");
}

// 2. Add the component right before the closing </body> tag
const COMPONENT = `<MobileBottomNav />`;
if (!content.includes(COMPONENT)) {
  content = content.replace("</body>", `  <MobileBottomNav />\n</body>`);
}

// 3. Add padding to the body so the bottom nav doesn't cover content on mobile
if (content.includes('<body className="')) {
  content = content.replace('<body className="', '<body className="pb-16 md:pb-0 ');
} else if (content.includes('<body>')) {
  content = content.replace('<body>', '<body className="pb-16 md:pb-0">');
}

fs.writeFileSync(layoutPath, content, 'utf8');

console.log('✅ SUCCESS: Updated src/app/layout.tsx');
console.log('   - Imported MobileBottomNav.');
console.log('   - Added <MobileBottomNav /> before </body>.');
console.log('   - Added "pb-16 md:pb-0" to <body> to prevent content overlap on mobile.');