import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('1. Deleting .next cache folder...');
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
  console.log('   Cache deleted.');
} else {
  console.log('   No cache to delete.');
}

console.log('2. Rewriting globals.css for Tailwind v4...');
const cssPath = path.join('src', 'app', 'globals.css');
const cssContent = `@import "tailwindcss";

@theme {
  --color-brand-50: #fafaf9;
  --color-brand-100: #f5f5f4;
  --color-brand-200: #e7e5e4;
  --color-brand-300: #d6d3d1;
  --color-brand-400: #a8a29e;
  --color-brand-500: #78716c;
  --color-brand-600: #57534e;
  --color-brand-700: #44403c;
  --color-brand-800: #292524;
  --color-brand-900: #1c1917;
  
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-brand-50);
  color: var(--color-brand-900);
}
`;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('   globals.css updated.');

console.log('3. Verifying postcss.config.mjs...');
const postcssPath = 'postcss.config.mjs';
const postcssContent = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
`;
fs.writeFileSync(postcssPath, postcssContent, 'utf8');
console.log('   postcss.config.mjs updated.');

console.log('4. Updating layout.tsx to force base styles...');
const layoutPath = path.join('src', 'app', 'layout.tsx');
let layoutCode = fs.readFileSync(layoutPath, 'utf8');

// Ensure body has the font-sans class and bg color
const oldBody = `<body className="bg-brand-50 text-brand-900 min-h-screen flex flex-col">`;
const newBody = `<body className={\`\${inter.variable} font-sans antialiased bg-brand-50 text-brand-900 min-h-screen flex flex-col\`}>`;

if (layoutCode.includes(oldBody)) {
  layoutCode = layoutCode.replace(oldBody, newBody);
  fs.writeFileSync(layoutPath, layoutCode, 'utf8');
  console.log('   layout.tsx updated.');
} else {
  console.log('   layout.tsx body class already looks okay or different.');
}

console.log('\nStyling fix complete. Please run: npm run dev');