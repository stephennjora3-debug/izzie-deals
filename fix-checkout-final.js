import fs from 'fs';
import path from 'path';

console.log('Applying final checkout and validation fixes...\n');

// ==========================================
// 1. FIX CHECKOUT PAGE (County Dropdown)
// ==========================================
const checkoutPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'checkout', 'page.tsx');
let checkoutContent = fs.readFileSync(checkoutPath, 'utf8');

// ANCHOR 1: Add KENYA_COUNTIES constant after imports
const OLD_IMPORTS = `import { createOrder, ShippingDetails } from '@/actions/order.actions';

export default function CheckoutPage() {`;

const NEW_IMPORTS = `import { createOrder, ShippingDetails } from '@/actions/order.actions';

// All 47 counties in Kenya
const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

export default function CheckoutPage() {`;

if (!checkoutContent.includes(OLD_IMPORTS)) {
  console.log("ANCHOR 1 NOT FOUND (Checkout imports)");
  process.exit(1);
}
checkoutContent = checkoutContent.split(OLD_IMPORTS).join(NEW_IMPORTS);

// ANCHOR 2: Update initial state to have empty city/county
const OLD_STATE = `  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: 'Nairobi',
  });`;

const NEW_STATE = `  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '', // Will be used for County selection
  });`;

if (!checkoutContent.includes(OLD_STATE)) {
  console.log("ANCHOR 2 NOT FOUND (Checkout state)");
  process.exit(1);
}
checkoutContent = checkoutContent.split(OLD_STATE).join(NEW_STATE);

// ANCHOR 3: Replace City Input with County Select
const OLD_CITY_INPUT = `                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">City</label>
                  <Input 
                    required 
                    value={shipping.city} 
                    onChange={e => setShipping({...shipping, city: e.target.value})} 
                  />
                </div>`;

const NEW_COUNTY_SELECT = `                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">County</label>
                  <select 
                    required
                    className="w-full px-3 py-2 border border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-brand-900"
                    value={shipping.city}
                    onChange={e => setShipping({...shipping, city: e.target.value})}
                  >
                    <option value="" disabled>Select County</option>
                    {KENYA_COUNTIES.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>`;

if (!checkoutContent.includes(OLD_CITY_INPUT)) {
  console.log("ANCHOR 3 NOT FOUND (City input)");
  process.exit(1);
}
checkoutContent = checkoutContent.split(OLD_CITY_INPUT).join(NEW_COUNTY_SELECT);

fs.writeFileSync(checkoutPath, checkoutContent, 'utf8');
console.log('✅ Updated Checkout Page: Added 47 Kenyan Counties dropdown.');


// ==========================================
// 2. FIX ORDER ACTIONS (Relax Zod Validation)
// ==========================================
const actionsPath = path.join(process.cwd(), 'src', 'actions', 'order.actions.ts');
let actionsContent = fs.readFileSync(actionsPath, 'utf8');

// ANCHOR 4: Relax Zod validation to prevent false "Failed to create order"
const OLD_SCHEMA = `const shippingSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  addressLine1: z.string().min(5).max(200),
  city: z.string().min(2).max(100), // Now stores county name
});`;

const NEW_SCHEMA = `const shippingSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(100),
  phone: z.string().min(1, "Phone is required").max(20), // Relaxed for formats like "0712 345 678" or "+254..."
  addressLine1: z.string().min(1, "Address is required").max(250),
  city: z.string().min(1, "County is required").max(100),
});`;

if (!actionsContent.includes(OLD_SCHEMA)) {
  console.log("ANCHOR 4 NOT FOUND (Zod schema in order.actions.ts)");
  // Try to find a close match and warn
  console.log("Warning: Could not find exact Zod schema. Manual review may be needed.");
} else {
  actionsContent = actionsContent.split(OLD_SCHEMA).join(NEW_SCHEMA);
  fs.writeFileSync(actionsPath, actionsContent, 'utf8');
  console.log('✅ Updated Order Actions: Relaxed Zod validation to prevent false rejections.');
}

console.log('\n🎉 Fixes applied successfully!');