import fs from 'fs';
import path from 'path';

console.log('🚀 Rebranding Aura Commerce to Izzie Deals...\n');

// 1. Update Header (Logo)
const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');
if (fs.existsSync(headerPath)) {
  let code = fs.readFileSync(headerPath, 'utf8');
  // Replace the text "Aura" with the new logo image
  code = code.replace(/>(Aura|Aura Commerce)</g, '><img src="/izzie.png" alt="Izzie Deals" className="h-10 w-auto object-contain" /><');
  // Fallback if it's just the word Aura in a specific tag
  code = code.replace(/"Aura"/g, '"Izzie Deals"');
  fs.writeFileSync(headerPath, code, 'utf8');
  console.log('✅ Updated Header with Izzie Deals logo.');
} else {
  console.log('️ Header.tsx not found. You may need to update the logo manually.');
}

// 2. Update Footer
const footerPath = path.join('src', 'components', 'layout', 'Footer.tsx');
if (fs.existsSync(footerPath)) {
  let code = fs.readFileSync(footerPath, 'utf8');
  code = code.replace(/Aura Commerce/g, 'Izzie Deals');
  code = code.replace(/Aura/g, 'Izzie Deals');
  fs.writeFileSync(footerPath, code, 'utf8');
  console.log('✅ Updated Footer text.');
}

// 3. Update Global Layout Metadata
const layoutPath = path.join('src', 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  let code = fs.readFileSync(layoutPath, 'utf8');
  code = code.replace(/Aura Commerce/g, 'Izzie Deals');
  code = code.replace(/title: 'Aura/g, "title: 'Izzie");
  fs.writeFileSync(layoutPath, code, 'utf8');
  console.log('✅ Updated global metadata.');
}

// 4. Update Receipt Page Header
const receiptPath = path.join('src', 'app', 'admin', 'orders', 'receipt', 'page.tsx');
if (fs.existsSync(receiptPath)) {
  let code = fs.readFileSync(receiptPath, 'utf8');
  code = code.replace(/AURA COMMERCE/g, 'IZZIE DEALS');
  code = code.replace(/Aura Commerce/g, 'Izzie Deals');
  fs.writeFileSync(receiptPath, code, 'utf8');
  console.log('✅ Updated Receipt page header.');
}

// 5. Add Hero Section to Shipping Page
const shippingPath = path.join('src', 'app', 'shipping', 'page.tsx');
if (fs.existsSync(shippingPath)) {
  let code = fs.readFileSync(shippingPath, 'utf8');
  
  const heroSection = `
      {/* Hero Section with Background Image */}
      <div className="relative h-64 md:h-80 w-full mb-12 rounded-xl overflow-hidden shadow-lg">
        <img 
          src="/shipping.jfif" 
          alt="Delivery Truck" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">Shipping & Delivery</h1>
          <p className="text-lg text-gray-200 drop-shadow-sm">Fast, reliable delivery across Kenya</p>
        </div>
      </div>
  `;

  // Inject hero section right after the opening container div
  if (code.includes('<div className="container mx-auto px-4 py-16 max-w-4xl">')) {
    code = code.replace(
      '<div className="container mx-auto px-4 py-16 max-w-4xl">',
      `<div className="container mx-auto px-4 py-16 max-w-4xl">\n${heroSection}`
    );
    
    // Remove the old text-based header since we now have a hero section
    code = code.replace(/<div className="text-center mb-12">[\s\S]*?<\/div>/, '');
    
    fs.writeFileSync(shippingPath, code, 'utf8');
    console.log('✅ Added Hero section to Shipping page.');
  }
}

console.log('\n🎉 Rebranding to Izzie Deals complete!');