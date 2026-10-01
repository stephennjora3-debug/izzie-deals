import fs from 'fs';
import path from 'path';

console.log('🔧 Final attempt to fix the logo...\n');

// Try to find the Header file
const possiblePaths = [
  path.join('src', 'components', 'layout', 'Header.tsx'),
  path.join('src', 'components', 'layout', 'Navbar.tsx'),
  path.join('src', 'components', 'Header.tsx'),
  path.join('src', 'components', 'Navbar.tsx')
];

let headerPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    headerPath = p;
    break;
  }
}

if (!headerPath) {
  console.error('❌ Could not find Header.tsx or Navbar.tsx. Please tell me where it is.');
  process.exit(1);
}

console.log('✅ Found header file at:', headerPath);

let code = fs.readFileSync(headerPath, 'utf8');

// 1. Try to replace the text "Aura" directly
// This looks for >Aura< and replaces it with the image tag
const auraRegex = />Aura</g;
if (auraRegex.test(code)) {
  code = code.replace(auraRegex, '><img src="/izzie.png" alt="Izzie Deals" className="h-8 md:h-10 w-auto object-contain" /><');
  console.log('✅ Replaced "Aura" text with logo image.');
} else {
  console.log('⚠️ Could not find ">Aura<" in the file. The logo might be implemented differently.');
  console.log('\n--- First 50 lines of the file ---');
  console.log(code.split('\n').slice(0, 50).join('\n'));
  console.log('----------------------------------');
  console.log('\nPlease copy the code above and paste it here so I can see exactly how the logo is written.');
}

// 2. Also replace any variables named "Aura"
code = code.replace(/"Aura"/g, '"Izzie Deals"');
code = code.replace(/'Aura'/g, "'Izzie Deals'");

fs.writeFileSync(headerPath, code, 'utf8');