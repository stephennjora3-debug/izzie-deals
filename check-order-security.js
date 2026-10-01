import fs from 'fs';
import path from 'path';

const filesToCheck = [
  'src/actions/order.actions.ts',
  'src/app/api/checkout/route.ts',
  'src/app/api/orders/route.ts'
];

console.log('Checking order creation logic for server-side validation...\n');

let foundAny = false;

filesToCheck.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  console.log('========================================');
  console.log('FILE: ' + filePath);
  console.log('========================================');
  
  if (fs.existsSync(fullPath)) {
    foundAny = true;
    const content = fs.readFileSync(fullPath, 'utf8');
    // Print the file content to analyze how totals/prices are handled
    console.log(content);
  } else {
    console.log('WARNING: FILE NOT FOUND');
  }
  
  console.log('\n========================================\n');
});

if (!foundAny) {
  console.log('No order action/route files found in expected locations.');
  console.log('Searching for any file containing "createOrder" or "checkout"...');
  
  const srcDir = path.join(process.cwd(), 'src');
  function searchFiles(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '.next') {
        searchFiles(fullPath);
      } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.tsx'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
          if (content.includes('createorder') || content.includes('checkout')) {
            console.log('- ' + path.relative(process.cwd(), fullPath));
          }
        } catch (e) {}
      }
    }
  }
  searchFiles(srcDir);
}

console.log('\nCheck complete. Please copy the output above and paste it here.');