import fs from 'fs';
import path from 'path';

const filePath = path.join('src', 'app', '(shop)', 'product', '[slug]', 'page.tsx');

if (!fs.existsSync(filePath)) {
  console.log('File not found:', filePath);
  process.exit(1);
}

let c = fs.readFileSync(filePath, 'utf8');

// 1. Add useCartStore import
if (!c.includes("import { useCartStore } from '@/store/cartStore';")) {
  c = c.replace(
    "import { Button } from '@/components/ui/Button';",
    "import { Button } from '@/components/ui/Button';\nimport { useCartStore } from '@/store/cartStore';"
  );
  console.log('1. Added useCartStore import.');
}

// 2. Initialize the store hook inside the component
if (!c.includes("const addItem = useCartStore")) {
  c = c.replace(
    "const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');",
    "const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');\n  const addItem = useCartStore((state) => state.addItem);"
  );
  console.log('2. Added addItem hook.');
}

// 3. Update the Add to Cart button onClick
const OLD_BUTTON = `<Button size="lg" className="flex-1" disabled={isOutOfStock}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>`;

const NEW_BUTTON = `<Button 
                size="lg" 
                className="flex-1" 
                disabled={isOutOfStock}
                onClick={() => {
                  if (!isOutOfStock) {
                    addItem({
                      productId: mockProduct.id,
                      variantId: currentVariant?.id,
                      name: mockProduct.name,
                      price: displayPrice,
                      quantity: quantity,
                      image: mockProduct.images[0],
                      attributes: { Size: selectedSize, Color: selectedColor }
                    });
                  }
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>`;

if (c.includes(OLD_BUTTON)) {
  c = c.split(OLD_BUTTON).join(NEW_BUTTON);
  console.log('3. Updated Add to Cart button with onClick logic.');
} else {
  console.log('Warning: Could not find exact Add to Cart button block.');
}

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nProduct Detail page updated.');