import fs from 'fs';
import path from 'path';

console.log('🔧 Replacing the exact "Aura" text block with the logo image...\n');

const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');

if (fs.existsSync(headerPath)) {
  let code = fs.readFileSync(headerPath, 'utf8');
  
  // The exact block we want to replace
  const oldBlock = `          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-brand-900">
            Aura
          </Link>`;

  // The new block with the image
  const newBlock = `          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/izzie.png" alt="Izzie Deals" className="h-8 md:h-10 w-auto object-contain" />
          </Link>`;

  if (code.includes(oldBlock)) {
    code = code.replace(oldBlock, newBlock);
    fs.writeFileSync(headerPath, code, 'utf8');
    console.log('✅ Successfully replaced the "Aura" text block with the izzie.png logo!');
  } else {
    console.log('⚠️ Could not find the exact block. Let\'s try a simpler replacement...');
    
    // Fallback: just replace the word "Aura" inside the Link
    code = code.replace(
      /<Link href="\/" className="text-2xl font-bold text-brand-900">\s*Aura\s*<\/Link>/,
      `<Link href="/" className="flex items-center">\n            <img src="/izzie.png" alt="Izzie Deals" className="h-8 md:h-10 w-auto object-contain" />\n          </Link>`
    );
    fs.writeFileSync(headerPath, code, 'utf8');
    console.log('✅ Applied fallback replacement for the logo.');
  }
} else {
  console.log('❌ Header.tsx not found.');
}