import fs from 'fs';
import path from 'path';

console.log('🔧 Adding Like buttons to products...\n');

// 1. Create LikeButton component
const likeButtonDir = path.join('src', 'components', 'ui');
fs.mkdirSync(likeButtonDir, { recursive: true });
const likeButtonPath = path.join(likeButtonDir, 'LikeButton.tsx');

const likeButtonCode = `'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export function LikeButton({ productId }: { productId: string }) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Check if product is liked on mount
    const liked = localStorage.getItem(\`liked_\${productId}\`) === 'true';
    setIsLiked(liked);
  }, [productId]);

  const toggleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    localStorage.setItem(\`liked_\${productId}\`, newLiked.toString());
    
    // Optional: Show a quick animation or toast
    if (newLiked) {
      console.log('Added to favorites:', productId);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={\`p-2 rounded-full transition-all duration-200 \${
        isLiked 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50'
      }\`}
      aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={\`h-5 w-5 transition-all \${isLiked ? 'fill-current' : ''}\`} 
      />
    </button>
  );
}
`;

fs.writeFileSync(likeButtonPath, likeButtonCode, 'utf8');
console.log('1. Created LikeButton component.');

// 2. Find and update the ProductCard component
const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');

if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  // Add LikeButton import
  if (!code.includes("import { LikeButton } from '@/components/ui/LikeButton';")) {
    code = "import { LikeButton } from '@/components/ui/LikeButton';\n" + code;
  }
  
  // Find where to add the like button (usually near the image or title)
  // Look for the product image or card header
  if (code.includes('className="relative"') || code.includes('relative')) {
    // Add like button in the top-right corner of the card
    code = code.replace(
      /(<div className="relative">)/,
      \`$1
          <div className="absolute top-2 right-2 z-10">
            <LikeButton productId={product.id} />
          </div>\`
    );
    console.log('2. Added LikeButton to ProductCard.');
  } else {
    console.log('Warning: Could not find exact location in ProductCard. Manual update may be needed.');
  }
  
  fs.writeFileSync(productCardPath, code, 'utf8');
} else {
  console.log('ProductCard.tsx not found. Searching for alternative...');
  
  // Search for product card files
  const searchDir = path.join('src', 'components');
  const files = fs.readdirSync(searchDir, { recursive: true });
  const cardFiles = files.filter(f => f.toString().toLowerCase().includes('card') || f.toString().toLowerCase().includes('product'));
  console.log('Found files:', cardFiles);
}

console.log('\\n✅ Like buttons added!');