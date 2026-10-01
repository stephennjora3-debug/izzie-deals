import fs from 'fs';
import path from 'path';

console.log('📞 Updating WhatsApp phone numbers...\n');

const primaryNumber = '254748440083'; // International format for wa.me link
const secondaryNumber = '0111651116';

// 1. Update WhatsApp Button
const waPath = path.join('src', 'components', 'layout', 'WhatsAppButton.tsx');
if (fs.existsSync(waPath)) {
  let code = fs.readFileSync(waPath, 'utf8');
  code = code.replace('254712345678', primaryNumber);
  fs.writeFileSync(waPath, code, 'utf8');
  console.log('✅ Updated WhatsAppButton.tsx with 0748440083');
} else {
  console.log('⚠️ WhatsAppButton.tsx not found.');
}

// 2. Update Shipping Page
const shipPath = path.join('src', 'app', 'shipping', 'page.tsx');
if (fs.existsSync(shipPath)) {
  let code = fs.readFileSync(shipPath, 'utf8');
  
  // Update the wa.me link
  code = code.replace(/254712345678/g, primaryNumber);
  
  // Update the text to show both numbers nicely
  code = code.replace(
    'Our support team is available on WhatsApp to help you.',
    `Our support team is available to help you. Call/WhatsApp: <strong>0748 440 083</strong> or <strong>${secondaryNumber}</strong>.`
  );
  
  fs.writeFileSync(shipPath, code, 'utf8');
  console.log('✅ Updated shipping/page.tsx with both numbers');
} else {
  console.log('⚠️ shipping/page.tsx not found.');
}

console.log('\n📞 Phone numbers updated successfully!');