import fs from 'fs';
import path from 'path';

const filesToCheck = [
  'src/lib/auth.ts',
  'src/lib/supabase/server.ts',
  'src/middleware.ts',
  'src/app/admin/layout.tsx',
  'src/app/admin/page.tsx'
];

console.log('Checking current auth and admin setup...\n');

filesToCheck.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  console.log('========================================');
  console.log('FILE: ' + filePath);
  console.log('========================================');
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    // Print first 50 lines to avoid flooding the console, or full file if short
    const lines = content.split('\n');
    if (lines.length > 60) {
      console.log(lines.slice(0, 60).join('\n'));
      console.log('\n... (truncated for brevity) ...\n');
    } else {
      console.log(content);
    }
  } else {
    console.log('WARNING: FILE NOT FOUND');
  }
  
  console.log('\n========================================\n');
});

console.log('Check complete. Please copy the output above and paste it here.');