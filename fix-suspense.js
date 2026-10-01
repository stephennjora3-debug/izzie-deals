import fs from 'fs';
import path from 'path';

const successPath = path.join('src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

if (!fs.existsSync(successPath)) {
  console.log('File not found:', successPath);
  process.exit(1);
}

let c = fs.readFileSync(successPath, 'utf8');

// 1. Add Suspense import if not present
if (!c.includes("import { Suspense } from 'react';")) {
  c = "import { Suspense } from 'react';\n" + c;
}

// 2. Wrap the main return content in a Suspense boundary
// Look for the main return statement and wrap its contents
if (c.includes('return (') && !c.includes('<Suspense')) {
  // Find the return ( and add Suspense right after
  c = c.replace(
    /return \(\s*<div className="container/,
    `return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-brand-600">Loading order details...</div>}>
      <div className="container"`
  );
  
  // Find the last closing div before the final closing parenthesis of the return
  // This is a bit tricky with regex, so let's do a simpler replacement:
  // Replace the very last "  );\n}" with "  </Suspense>\n  );\n}"
  c = c.replace(
    /(\s+)\);(\s+)}(\s+)$/m,
    `  </Suspense>
  );
}`
  );
  
  console.log('1. Wrapped Success page content in Suspense boundary.');
}

fs.writeFileSync(successPath, c, 'utf8');
console.log('✅ Suspense boundary added to checkout/success page.');