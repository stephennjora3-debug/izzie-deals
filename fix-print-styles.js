import fs from 'fs';
import path from 'path';

console.log('🔧 Moving print styles to global CSS to fix Server Component error...\n');

// 1. Add print styles to globals.css
const globalsPath = path.join('src', 'app', 'globals.css');

const printStyles = `
/* --- Receipt Print Styles --- */
@media print {
  body * {
    visibility: hidden;
  }
  #receipt-content, #receipt-content * {
    visibility: visible;
  }
  #receipt-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20px;
    box-shadow: none !important;
    border: none !important;
    background: white !important;
  }
  .no-print {
    display: none !important;
  }
  @page {
    margin: 0;
    size: auto;
  }
}
/* --- End Receipt Print Styles --- */
`;

if (fs.existsSync(globalsPath)) {
  let css = fs.readFileSync(globalsPath, 'utf8');
  if (!css.includes('Receipt Print Styles')) {
    css += printStyles;
    fs.writeFileSync(globalsPath, css, 'utf8');
    console.log('✅ Added print styles to globals.css.');
  } else {
    console.log('✅ Print styles already exist in globals.css.');
  }
} else {
  console.log('⚠️ globals.css not found. Creating it...');
  fs.writeFileSync(globalsPath, printStyles, 'utf8');
}

// 2. Remove the broken <style jsx> block from the receipt page
const receiptPath = path.join('src', 'app', 'admin', 'orders', 'receipt', 'page.tsx');

if (fs.existsSync(receiptPath)) {
  let code = fs.readFileSync(receiptPath, 'utf8');
  
  // Remove the entire <style jsx global> block
  const styleRegex = /<style jsx global>\{`[\s\S]*?`\}<\/style>/;
  if (styleRegex.test(code)) {
    code = code.replace(styleRegex, '');
    fs.writeFileSync(receiptPath, code, 'utf8');
    console.log('✅ Removed invalid <style jsx> block from receipt page.');
  } else {
    console.log('✅ No <style jsx> block found to remove.');
  }
}

console.log('\n Print styles fixed!');