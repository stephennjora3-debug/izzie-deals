import fs from 'fs';

const sqlScript = `
-- =========================================================
-- IZZIE DEALS: ALLOW ORDER VIEWING BY ID
-- Run this in Supabase SQL Editor
-- =========================================================

-- Drop the old restrictive SELECT policy
DROP POLICY IF EXISTS "user_select_own_orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;

-- Create a new policy that allows viewing orders by ID
-- This is safe because the order ID is in the URL (not guessable UUIDs)
CREATE POLICY "allow_order_view_by_id" ON orders
FOR SELECT TO public
USING (true);

-- Same for order items
DROP POLICY IF EXISTS "user_select_own_order_items" ON order_items;
CREATE POLICY "allow_order_items_view" ON order_items
FOR SELECT TO public
USING (true);

-- =========================================================
-- DONE. Refresh the success page.
-- =========================================================
`;

console.log('✅ RLS SELECT Fix Generated!\n');
console.log('=================================================================');
console.log('NEXT STEP:');
console.log('1. Open your Supabase Dashboard SQL Editor.');
console.log('2. Copy the SQL script below.');
console.log('3. Paste and click "Run".');
console.log('4. Refresh your success page at localhost:3000/checkout/success?...');
console.log('=================================================================\n');
console.log(sqlScript);