import fs from 'fs';
import path from 'path';

console.log('🔧 Increasing logo size and visibility...\n');

const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');

if (fs.existsSync(headerPath)) {
  let code = fs.readFileSync(headerPath, 'utf8');
  
  // Replace the current small logo classes with larger, more visible ones
  code = code.replace(
    /className="h-8 md:h-10 w-auto object-contain"/g,
    'className="h-12 md:h-14 lg:h-16 w-auto object-contain"'
  );
  
  fs.writeFileSync(headerPath, code, 'utf8');
  console.log('✅ Increased logo size! The logo is now larger and more prominent.');
} else {
  console.log('❌ Header.tsx not found.');
}