import fs from 'fs';
import path from 'path';

const actionsPath = path.join(process.cwd(), 'src', 'actions', 'auth.actions.ts');

console.log('Checking auth actions...\n');

if (fs.existsSync(actionsPath)) {
  const content = fs.readFileSync(actionsPath, 'utf8');
  console.log('FILE: src/actions/auth.actions.ts');
  console.log('========================================');
  console.log(content);
  console.log('========================================');
} else {
  // Check alternative locations
  const altPath1 = path.join(process.cwd(), 'src', 'lib', 'actions.ts');
  const altPath2 = path.join(process.cwd(), 'app', 'actions', 'auth.actions.ts');
  
  if (fs.existsSync(altPath1)) {
    console.log('FILE: src/lib/actions.ts');
    console.log('========================================');
    console.log(fs.readFileSync(altPath1, 'utf8'));
    console.log('========================================');
  } else if (fs.existsSync(altPath2)) {
    console.log('FILE: app/actions/auth.actions.ts');
    console.log('========================================');
    console.log(fs.readFileSync(altPath2, 'utf8'));
    console.log('========================================');
  } else {
    console.log('WARNING: auth.actions.ts NOT FOUND in expected locations.');
  }
}

console.log('\nCheck complete. Please copy the output above and paste it here.');