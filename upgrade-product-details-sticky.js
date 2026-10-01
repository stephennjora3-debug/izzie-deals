import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'components', 'product', 'ProductDetailsClient.tsx');

console.log('Upgrading ProductDetailsClient with professional sticky mobile Add to Cart...\n');

let content = fs.readFileSync(filePath, 'utf8');

// ANCHOR: Replace the Quantity and Actions section
const OLD_ACTIONS = `            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-brand-300 rounded-md w-max">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-brand-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-brand-50 transition-colors"
                  disabled={isOutOfStock || (currentVariant && quantity >= currentVariant.stockQuantity)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button 
                size="lg" 
                className="flex-1" 
                disabled={isOutOfStock}
                onClick={() => {
                  if (!isOutOfStock) {
                    addItem({
                      productId: product.id,
                      variantId: currentVariant?.id,
                      name: product.name,
                      price: displayPrice,
                      quantity: quantity,
                      image: product.images[0],
                      attributes: { 
                        ...(selectedSize && { Size: selectedSize }), 
                        ...(selectedColor && { Color: selectedColor }) 
                      }
                    });
                  }
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button variant="outline" size="lg" className="flex-1">
                Buy Now
              </Button>

              <Button variant="ghost" size="icon" className="border border-brand-300">
                <Heart className="h-5 w-5" />
              </Button>
            </div>`;

const NEW_ACTIONS = `            {/* Desktop Quantity and Actions */}
            <div className="hidden sm:flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-brand-300 rounded-md w-max">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-brand-50 transition-colors rounded-l-md"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-brand-50 transition-colors rounded-r-md"
                  disabled={isOutOfStock || (currentVariant && quantity >= currentVariant.stockQuantity)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button 
                size="lg" 
                className="flex-1 h-12 text-base font-semibold" 
                disabled={isOutOfStock}
                onClick={() => {
                  if (!isOutOfStock) {
                    addItem({
                      productId: product.id,
                      variantId: currentVariant?.id,
                      name: product.name,
                      price: displayPrice,
                      quantity: quantity,
                      image: product.images[0],
                      attributes: { 
                        ...(selectedSize && { Size: selectedSize }), 
                        ...(selectedColor && { Color: selectedColor }) 
                      }
                    });
                  }
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button variant="outline" size="lg" className="flex-1 h-12 text-base font-semibold">
                Buy Now
              </Button>

              <Button variant="outline" size="icon" className="h-12 w-12 border-brand-300">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Sticky Add to Cart (Above Bottom Nav) */}
            <div className="sm:hidden fixed bottom-16 left-0 right-0 z-30 bg-white border-t border-brand-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-brand-300 rounded-md bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-brand-50 transition-colors rounded-l-md"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-brand-50 transition-colors rounded-r-md"
                    disabled={isOutOfStock || (currentVariant && quantity >= currentVariant.stockQuantity)}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <Button 
                  className="flex-1 h-12 text-base font-bold shadow-sm" 
                  disabled={isOutOfStock}
                  onClick={() => {
                    if (!isOutOfStock) {
                      addItem({
                        productId: product.id,
                        variantId: currentVariant?.id,
                        name: product.name,
                        price: displayPrice,
                        quantity: quantity,
                        image: product.images[0],
                        attributes: { 
                          ...(selectedSize && { Size: selectedSize }), 
                          ...(selectedColor && { Color: selectedColor }) 
                        }
                      });
                    }
                  }}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>`;

if (!content.includes(OLD_ACTIONS)) {
  console.log("ANCHOR NOT FOUND. The file might have been modified.");
  process.exit(1);
}

content = content.split(OLD_ACTIONS).join(NEW_ACTIONS);

// Add bottom padding to the main container so the sticky bar doesn't cover content on mobile
const OLD_CONTAINER = `    <div className="container mx-auto px-4 py-8">`;
const NEW_CONTAINER = `    <div className="container mx-auto px-4 py-8 sm:pb-8 pb-32">`;

if (content.includes(OLD_CONTAINER)) {
  content = content.split(OLD_CONTAINER).join(NEW_CONTAINER);
}

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ SUCCESS: Upgraded Product Details page!');
console.log('   - Desktop: Clean, professional row of buttons with uniform sizing (h-12).');
console.log('   - Mobile: Sticky "Add to Cart" bar fixed at the bottom (above the nav), thumb-friendly sizing.');
console.log('   - Added bottom padding (pb-32) to prevent content overlap on mobile.');