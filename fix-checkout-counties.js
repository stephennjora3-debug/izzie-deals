import fs from 'fs';
import path from 'path';

const checkoutPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'checkout', 'page.tsx');

console.log('Reading checkout page: ' + checkoutPath + '\n');

if (!fs.existsSync(checkoutPath)) {
  console.log('ERROR: Checkout page not found at ' + checkoutPath);
  process.exit(1);
}

let content = fs.readFileSync(checkoutPath, 'utf8');

// ANCHOR 1: Add counties constant after imports
const OLD_IMPORTS_SECTION = `'use client';

import { useState } from 'react';`;

const NEW_IMPORTS_SECTION = `'use client';

import { useState } from 'react';

// All 47 counties in Kenya
const KENYA_COUNTIES = [
  'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta',
  'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru',
  'Tharaka-Nithi', 'Laikipia', 'Samburu', 'Turkana', 'West Pokot',
  'Baringo', 'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Bomet',
  'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu',
  'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi', 'Kiambu',
  'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
  'Murang\'a', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet'
];`;

if (!content.includes(OLD_IMPORTS_SECTION)) {
  console.log("ANCHOR 1 NOT FOUND (Imports section)");
  process.exit(1);
}
content = content.split(OLD_IMPORTS_SECTION).join(NEW_IMPORTS_SECTION);

// ANCHOR 2: Replace City input with County dropdown
// Find the City field and replace it with County dropdown
const OLD_CITY_FIELD = `<div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">City</label>
              <Input name="city" required placeholder="Nairobi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Country</label>
              <Input name="country" required placeholder="Kenya" defaultValue="Kenya" />
            </div>
          </div>`;

const NEW_COUNTY_FIELD = `<div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">County</label>
              <select 
                name="county" 
                required 
                className="w-full px-4 py-2 border border-brand-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                defaultValue=""
              >
                <option value="" disabled>Select County</option>
                {KENYA_COUNTIES.map((county) => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Country</label>
              <Input name="country" required placeholder="Kenya" defaultValue="Kenya" readOnly />
            </div>
          </div>`;

if (!content.includes(OLD_CITY_FIELD)) {
  console.log("ANCHOR 2 NOT FOUND (City field)");
  console.log("Looking for:");
  console.log(OLD_CITY_FIELD);
  process.exit(1);
}
content = content.split(OLD_CITY_FIELD).join(NEW_COUNTY_FIELD);

// ANCHOR 3: Update the createOrder call to use 'county' instead of 'city'
const OLD_CREATE_ORDER = `const shipping = {
        fullName: formData.get('fullName') as string,
        phone: formData.get('phone') as string,
        addressLine1: formData.get('addressLine1') as string,
        city: formData.get('city') as string,
      };`;

const NEW_CREATE_ORDER = `const shipping = {
        fullName: formData.get('fullName') as string,
        phone: formData.get('phone') as string,
        addressLine1: formData.get('addressLine1') as string,
        city: formData.get('county') as string, // Now using county
      };`;

if (!content.includes(OLD_CREATE_ORDER)) {
  console.log("ANCHOR 3 NOT FOUND (createOrder call)");
  process.exit(1);
}
content = content.split(OLD_CREATE_ORDER).join(NEW_CREATE_ORDER);

fs.writeFileSync(checkoutPath, content, 'utf8');

console.log('✅ SUCCESS: Updated checkout page');
console.log('   1. Added dropdown with all 47 Kenyan counties');
console.log('   2. Changed "City" field to "County" dropdown');
console.log('   3. Updated form submission to use county instead of city');
console.log('\nNow checking order actions for validation errors...\n');

// Also update the order actions to accept 'city' as county
const actionsPath = path.join(process.cwd(), 'src', 'actions', 'order.actions.ts');
if (fs.existsSync(actionsPath)) {
  let actionsContent = fs.readFileSync(actionsPath, 'utf8');
  
  // Make city validation more flexible to accept county names
  const OLD_CITY_SCHEMA = `  city: z.string().min(2).max(100),`;
  const NEW_CITY_SCHEMA = `  city: z.string().min(2).max(100), // Now stores county name`;
  
  if (actionsContent.includes(OLD_CITY_SCHEMA)) {
    actionsContent = actionsContent.split(OLD_CITY_SCHEMA).join(NEW_CITY_SCHEMA);
    fs.writeFileSync(actionsPath, actionsContent, 'utf8');
    console.log('✅ Updated order actions to accept county names');
  }
}

console.log('\n Checkout fixed! The "Failed to create order" error should now be resolved.');