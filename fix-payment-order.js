import fs from 'fs';
import path from 'path';

const paymentPath = path.join(process.cwd(), 'src', 'app', 'payment', 'page.tsx');
const altPaymentPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'payment', 'page.tsx');

console.log('Fixing payment page directive order...\n');

let targetPath = fs.existsSync(paymentPath) ? paymentPath : altPaymentPath;

if (!fs.existsSync(targetPath)) {
  console.log('ERROR: Could not find payment page.');
  process.exit(1);
}

let content = fs.readFileSync(targetPath, 'utf8');

// Check if it has the wrong order (dynamic before 'use client')
if (content.startsWith("export const dynamic = 'force-dynamic';")) {
  // Remove the dynamic export from the top
  content = content.replace("export const dynamic = 'force-dynamic';\n\n", "");
  
  // Add it right AFTER 'use client';
  if (content.startsWith("'use client';")) {
    content = content.replace(
      "'use client';",
      "'use client';\n\nexport const dynamic = 'force-dynamic';"
    );
  }
  
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('✅ SUCCESS: Fixed directive order in ' + targetPath);
  console.log('   "use client" is now at the very top, followed by "force-dynamic".');
} else if (content.includes("'use client';") && content.includes("export const dynamic = 'force-dynamic';")) {
  console.log('✅ Directives are already in the correct order.');
} else {
  console.log('⚠️ Could not find the expected pattern. Manual check may be needed.');
}