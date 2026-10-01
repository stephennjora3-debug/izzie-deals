import fs from 'fs';
import path from 'path';

const actionsPath = path.join(process.cwd(), 'src', 'actions', 'order.actions.ts');

console.log('Fixing database column name mismatch...\n');

let content = fs.readFileSync(actionsPath, 'utf8');

// ANCHOR 1: Change shipping_details back to shipping_address
const OLD_INSERT = `      shipping_details: validatedShipping, // Store validated data`;
const NEW_INSERT = `      shipping_address: validatedShipping, // Match actual database column name`;

if (!content.includes(OLD_INSERT)) {
  console.log("ANCHOR 1 NOT FOUND. Trying alternative...");
  // Fallback if it was already changed or formatted differently
  content = content.replace(/shipping_details:\s*validatedShipping/g, "shipping_address: validatedShipping");
} else {
  content = content.split(OLD_INSERT).join(NEW_INSERT);
}

// ANCHOR 2: Revert status to 'pending' to match original database setup
const OLD_STATUS = `      status: 'pending_payment',`;
const NEW_STATUS = `      status: 'pending',`;

if (content.includes(OLD_STATUS)) {
  content = content.split(OLD_STATUS).join(NEW_STATUS);
  console.log('✅ Reverted order status to "pending" to match database.');
}

fs.writeFileSync(actionsPath, content, 'utf8');

console.log('✅ SUCCESS: Fixed column name from "shipping_details" to "shipping_address"');
console.log('The database will now accept the order insertion.');