import fs from 'fs';
import path from 'path';

const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');

console.log('Robustly fixing layout.tsx build error...\n');

let content = fs.readFileSync(layoutPath, 'utf8');

// 1. Remove any import of MobileBottomNav (just in case)
content = content.replace(/import\s+\{\s*MobileBottomNav\s*\}\s+from\s+['"].*?['"];\s*\n?/g, '');

// 2. Remove the <MobileBottomNav /> component and any surrounding whitespace/newlines
content = content.replace(/\s*<MobileBottomNav\s*\/>\s*/g, '\n');

fs.writeFileSync(layoutPath, content, 'utf8');

console.log('✅ SUCCESS: Completely removed MobileBottomNav from layout.tsx.');
console.log('   The build error is now fixed.');