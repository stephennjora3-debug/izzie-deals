import fs from 'fs';
import path from 'path';

const checkoutPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'checkout', 'page.tsx');

console.log('Fixing syntax error in checkout page...\n');

let content = fs.readFileSync(checkoutPath, 'utf8');

// ANCHOR: The exact broken line
const OLD = "'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang'a', 'Nairobi',";
const NEW = "'Marsabit', 'Meru', 'Migori', 'Mombasa', \"Murang'a\", 'Nairobi',";

if (!content.includes(OLD)) {
  console.log("ANCHOR NOT FOUND. Trying alternative...");
  // Fallback just in case
  content = content.replace(/'Murang'a'/g, "\"Murang'a\"");
} else {
  content = content.split(OLD).join(NEW);
}

fs.writeFileSync(checkoutPath, content, 'utf8');

console.log('✅ SUCCESS: Fixed the unescaped quote in "Murang\'a"');
console.log('The build error should now be resolved.');