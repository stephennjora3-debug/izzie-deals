import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/lib/admin.ts');

console.log('Checking file: ' + filePath + '\n');

// Read before writing: check if file exists to prevent accidental overwrites
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('FILE ALREADY EXISTS. Current content:');
  console.log(content);
  console.log('\nStopping to prevent accidental overwrite.');
  process.exit(1);
} else {
  console.log('File does not exist. Creating new file...\n');
}

const newContent = `const ADMIN_EMAILS = [
  'gitongab210@gmail.com',
  'stephennjora3@gmail.com',
  'njorastephen1@gmail.com'
];

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
`;

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('✅ SUCCESS: Created src/lib/admin.ts');
console.log('   Added ADMIN_EMAILS array with your 3 emails.');
console.log('   Added isAdmin() helper function to check user access.');