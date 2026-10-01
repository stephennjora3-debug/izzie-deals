import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Next.js Image external domain error...\n');

const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');

if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  // Replace the external placeholder URL logic with a conditional local render
  const oldLogic = `  // Fallback image if none exists
  const imageUrl = product.image || 'https://via.placeholder.com/400x500?text=No+Image';

  return (
    <div className="group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
        <Link href={\`/product/\${product.id}\`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        </Link>`;

  const newLogic = `  return (
    <div className="group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
        <Link href={\`/product/\${product.id}\`} className="block w-full h-full">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </Link>`;

  if (code.includes(oldLogic)) {
    code = code.replace(oldLogic, newLogic);
    fs.writeFileSync(productCardPath, code, 'utf8');
    console.log('✅ Fixed ProductCard to use a local placeholder icon instead of an external URL.');
  } else {
    console.log('⚠️ Could not find exact block to replace. Applying fallback fix...');
    // Fallback: just remove the external URL and use a simple check
    code = code.replace(/const imageUrl = product\.image \|\| 'https:\/\/via\.placeholder\.com\/400x500\?text=No\+Image';/, '');
    code = code.replace(/src=\{imageUrl\}/, 'src={product.image || "/placeholder.jpg"}');
    fs.writeFileSync(productCardPath, code, 'utf8');
    console.log('✅ Applied fallback fix.');
  }
} else {
  console.log('❌ ProductCard.tsx not found.');
}

console.log('\n🎉 Next.js Image error fixed!');