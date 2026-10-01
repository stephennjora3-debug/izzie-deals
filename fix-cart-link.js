import fs from 'fs';
import path from 'path';

const filePath = path.join('src', 'app', '(shop)', 'cart', 'page.tsx');

if (!fs.existsSync(filePath)) {
  console.log('File not found:', filePath);
  process.exit(1);
}

let c = fs.readFileSync(filePath, 'utf8');

const OLD_BUTTON = `<Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>`;

const NEW_BUTTON = `<Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>`;

if (c.includes(OLD_BUTTON)) {
  c = c.split(OLD_BUTTON).join(NEW_BUTTON);
  fs.writeFileSync(filePath, c, 'utf8');
  console.log('Cart page "Proceed to Checkout" button updated to link to /checkout.');
} else {
  console.log('Warning: Could not find exact button block. Manual check may be needed.');
}