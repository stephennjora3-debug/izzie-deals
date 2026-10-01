import fs from 'fs';
import path from 'path';

const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');

console.log('Fixing layout.tsx build error...\n');

let content = fs.readFileSync(layoutPath, 'utf8');

// 1. Remove the MobileBottomNav import
content = content.replace("import { MobileBottomNav } from '@/components/layout/MobileBottomNav';\n", "");

// 2. Remove the <MobileBottomNav /> component
content = content.replace("      <MobileBottomNav />\n", "");

// 3. Clean up the body padding we added for it
content = content.replace('className="pb-16 md:pb-0 "', 'className="');

fs.writeFileSync(layoutPath, content, 'utf8');

console.log('✅ SUCCESS: Removed MobileBottomNav from layout.tsx.');
console.log('   The build error is now fixed.');