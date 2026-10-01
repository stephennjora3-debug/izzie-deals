import fs from 'fs';
import path from 'path';

const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');

if (!fs.existsSync(headerPath)) {
  console.log('Header not found');
  process.exit(1);
}

let code = fs.readFileSync(headerPath, 'utf8');

// 1. Find and remove the old search block (the one with placeholder="Search products...")
// We look for a <div> or <form> that contains this specific input.
const oldBlockRegex = /<(?:div|form)[^>]*>[\s\S]*?placeholder="Search products\.\.\."[\s\S]*?<\/(?:div|form)>/g;

const matches = code.match(oldBlockRegex);
if (matches) {
  console.log(`Found ${matches.length} old search block(s). Removing...`);
  code = code.replace(oldBlockRegex, '');
} else {
  console.log('Could not find the exact old block. Trying a broader search...');
  // Fallback: Just remove any line containing the placeholder
  const lines = code.split('\n');
  const filteredLines = lines.filter(line => !line.includes('placeholder="Search products..."'));
  // Also remove the <Search icon /> that was above it if it's now orphaned
  // This is tricky, so let's just do the regex first.
}

// 2. Ensure the new <SearchInput /> component is in the header
if (!code.includes('<SearchInput />')) {
  console.log('Adding <SearchInput /> component...');
  // Add it right before the Cart link
  code = code.replace('<Link href="/cart"', '<SearchInput />\n              <Link href="/cart"');
}

// 3. Clean up any orphaned <Search /> icons that might have been left behind
// If there's a <Search className="absolute left-3..." that is no longer inside a form/div with an input, we should remove it.
// Actually, the new <SearchInput /> component has its own icon, so we don't need the one in Header.tsx anymore if it was part of the old block.
// The regex above should have removed it along with the div.

fs.writeFileSync(headerPath, code, 'utf8');
console.log('Header cleaned up. Only one search bar should remain.');