import fs from 'fs';
import path from 'path';

const actionsPath = path.join(process.cwd(), 'src', 'actions', 'order.actions.ts');

console.log('Applying final fixes and deep error logging...\n');

let content = fs.readFileSync(actionsPath, 'utf8');

// FIX 1: Allow variantId to be null (common issue with cart stores)
const OLD_VARIANT = `variantId: z.string().min(1).optional().or(z.literal(null)).or(z.literal(undefined)), // Accept null, undefined, or string`;
const NEW_VARIANT = `variantId: z.union([z.string().uuid(), z.null(), z.undefined()]).optional(), // Strictly allow null, undefined, or UUID`;

if (content.includes(OLD_VARIANT)) {
  content = content.split(OLD_VARIANT).join(NEW_VARIANT);
  console.log('✅ Fixed variantId validation to accept null.');
}

// FIX 2: Add deep error logging for Database failures
const OLD_DB_INSERT = `  if (orderError || !order) {
    console.error('Order creation failed:', orderError);
    throw new Error('Failed to create order');
  }`;

const NEW_DB_INSERT = `  if (orderError || !order) {
    console.error('❌ DATABASE ERROR DETAILS:', JSON.stringify(orderError, null, 2));
    throw new Error('Database error: ' + (orderError?.message || 'Unknown DB error'));
  }`;

if (content.includes(OLD_DB_INSERT)) {
  content = content.split(OLD_DB_INSERT).join(NEW_DB_INSERT);
  console.log('✅ Added detailed database error logging.');
}

// FIX 3: Ensure user_id handles nulls safely for guest checkout
const OLD_USER_ID = `      user_id: userId,`;
const NEW_USER_ID = `      user_id: userId || null, // Explicitly null for guests`;

if (content.includes(OLD_USER_ID)) {
  content = content.split(OLD_USER_ID).join(NEW_USER_ID);
  console.log('✅ Fixed user_id null handling.');
}

fs.writeFileSync(actionsPath, content, 'utf8');

console.log('\n🎉 Scripts applied!');
console.log('=========================================================');
console.log('CRITICAL NEXT STEP:');
console.log('1. Look at your PowerShell terminal (where npm run dev is running).');
console.log('2. Try to place the order again on the website.');
console.log('3. If it fails, look for a message starting with "❌ DATABASE ERROR DETAILS:"');
console.log('   or " VALIDATION FAILED:" in that terminal window.');
console.log('4. COPY that exact text and paste it here.');
console.log('=========================================================');